const db = require('../config/db');
const NotificacionService = require('../services/NotificacionService');

/**
 * Crea una notificación para el dueño del pedido. Nunca debe tumbar la
 * respuesta principal si falla (por eso el try/catch propio): notificar es
 * un "extra", no algo de lo que dependa confirmar/cancelar un pedido.
 */
async function notificarCliente(idUsuario, mensaje, idVenta) {
    try {
        await NotificacionService.crearNotificacion(idUsuario, mensaje, idVenta);
    } catch (error) {
        console.error('Error al crear notificación:', error);
    }
}

/** Envía la misma notificación a todos los usuarios con rol 'admin' (para que se enteren de comprobantes nuevos por revisar). */
async function notificarAdmins(mensaje, idVenta) {
    try {
        const [admins] = await db.query("SELECT id_usuario FROM Usuario WHERE rol = 'admin'");
        for (const { id_usuario } of admins) {
            await NotificacionService.crearNotificacion(id_usuario, mensaje, idVenta);
        }
    } catch (error) {
        console.error('Error al notificar a los admins:', error);
    }
}

// ⏱️ Horas que un pedido puede quedar "Pendiente" sin que el admin confirme
// el pago (o sin que el cliente suba su comprobante de Yape/Plin) antes de
// cancelarse automáticamente y devolver el stock.
const HORAS_LIMITE_PENDIENTE = 24;

/**
 * Cancela automáticamente los pedidos que llevan más de HORAS_LIMITE_PENDIENTE
 * en estado "Pendiente" (el admin nunca confirmó el pago, o el cliente nunca
 * subió el comprobante de Yape/Plin). Devuelve el stock de cada producto,
 * igual que una cancelación manual. Se llama antes de listar pedidos para
 * que tanto el admin como el cliente vean el estado ya actualizado.
 */
async function cancelarPedidosVencidos() {
    try {
        const [vencidos] = await db.query(
            `SELECT id_venta, id_usuario FROM Venta
             WHERE estado_venta = 'Pendiente'
               AND fecha_hora <= DATE_SUB(NOW(), INTERVAL ? HOUR)`,
            [HORAS_LIMITE_PENDIENTE]
        );

        for (const { id_venta, id_usuario } of vencidos) {
            const [detalles] = await db.query('SELECT id_postre, cantidad FROM Detalle_Venta WHERE id_venta = ?', [id_venta]);
            for (const d of detalles) {
                await db.query('UPDATE Postre SET stock_total = stock_total + ? WHERE id_postre = ?', [d.cantidad, d.id_postre]);
            }
            await db.query("UPDATE Venta SET estado_venta = 'Cancelada' WHERE id_venta = ?", [id_venta]);
            await notificarCliente(
                id_usuario,
                `Tu pedido #${id_venta} se canceló automáticamente porque no se confirmó el pago dentro de ${HORAS_LIMITE_PENDIENTE} horas.`,
                id_venta
            );
        }

        if (vencidos.length > 0) {
            console.log(`⏱️ ${vencidos.length} pedido(s) pasaron a "Cancelada" por falta de confirmación de pago.`);
        }
    } catch (error) {
        console.error('Error al cancelar pedidos vencidos:', error);
    }
}

// 1. Registrar Venta
exports.registrarVenta = async (req, res) => {
    const { id_cliente, metodo_pago, tipo_comprobante, productos } = req.body;
    const id_usuario_sistema = req.usuario?.id_usuario;

    if (!id_usuario_sistema) {
        return res.status(401).json({ status: 'error', message: 'No se pudo identificar al usuario que registra la venta.' });
    }

    if (!productos || productos.length === 0) {
        return res.status(400).json({ status: 'error', message: 'El carrito está vacío.' });
    }

    const connection = await db.getConnection();
    try {
        await connection.query(
            'CALL sp_RegistrarVenta(?, ?, ?, ?, @p_id_venta)',
            [id_cliente || null, id_usuario_sistema, metodo_pago, tipo_comprobante || 'Boleta']
        );

        const [salidaVenta] = await connection.query('SELECT @p_id_venta AS id_venta');
        const id_venta = salidaVenta[0]?.id_venta;

        if (!id_venta) {
            throw new Error('No se pudo generar el ID de la venta.');
        }

        for (const prod of productos) {
            await connection.query('CALL sp_AgregarDetalleVenta(?, ?, ?)', [
                id_venta,
                prod.id_postre,
                prod.cantidad
            ]);
        }

        const [ventaRows] = await connection.query('SELECT * FROM Venta WHERE id_venta = ?', [id_venta]);

        return res.status(201).json({
            status: 'success',
            message: 'Venta registrada con éxito',
            data: {
                id_venta: id_venta,
                monto_total: ventaRows[0]?.monto_total,
                metodo_pago: ventaRows[0]?.metodo_pago,
                estado_venta: ventaRows[0]?.estado_venta,
                fecha: ventaRows[0]?.fecha_hora
            }
        });
    } catch (error) {
        console.error('Error al registrar venta:', error);
        return res.status(500).json({
            status: 'error',
            message: error.sqlMessage || 'Error interno al procesar la compra'
        });
    } finally {
        connection.release();
    }
};

// 2. Listar Ventas
exports.listarVentas = async (req, res) => {
    try {
        await cancelarPedidosVencidos();

        // Siempre filtramos por visible = 1
        const condiciones = ['v.visible = 1'];
        const params = [];

        if (req.usuario?.rol === 'cliente') {
            condiciones.push('v.id_usuario = ?');
            params.push(req.usuario.id_usuario);
        }

        if (req.query.estado) {
            condiciones.push('v.estado_venta = ?');
            params.push(req.query.estado);
        }

        const whereSql = `WHERE ${condiciones.join(' AND ')}`;

        const [rows] = await db.query(
            `SELECT v.id_venta, v.fecha_hora, v.monto_total, v.metodo_pago, v.comprobante_pago,
                    v.tipo_comprobante, v.estado_venta,
                    COALESCE(c.nombre_razon_social, 'Público General') AS cliente,
                    CONCAT(u.nombre, ' ', u.apellido) AS atendido_por
             FROM Venta v
             LEFT JOIN Cliente c ON v.id_cliente = c.id_cliente
             INNER JOIN Usuario u ON v.id_usuario = u.id_usuario
             ${whereSql}
             ORDER BY v.fecha_hora DESC`,
            params
        );
        return res.json(rows);
    } catch (error) {
        console.error('Error al listar ventas:', error);
        return res.status(500).json({ status: 'error', message: error.sqlMessage || 'Error al listar ventas' });
    }
};

// 3. Subir Comprobante (Yape/Plin)
exports.subirComprobante = async (req, res) => {
    try {
        const idVenta = req.params.id;

        if (!req.file) {
            return res.status(400).json({ status: 'error', message: 'Debes adjuntar una foto del comprobante.' });
        }

        const [ventaRows] = await db.query('SELECT id_usuario, id_venta FROM Venta WHERE id_venta = ?', [idVenta]);
        const venta = ventaRows[0];
        if (!venta) {
            return res.status(404).json({ status: 'error', message: 'Pedido no encontrado.' });
        }

        const esDueno = venta.id_usuario === req.usuario?.id_usuario;
        const esAdmin = req.usuario?.rol === 'admin';
        if (!esDueno && !esAdmin) {
            return res.status(403).json({ status: 'error', message: 'No puedes subir el comprobante de un pedido que no es tuyo.' });
        }

        const rutaRelativa = `/images/comprobantes/${req.file.filename}`;
        await db.query('UPDATE Venta SET comprobante_pago = ? WHERE id_venta = ?', [rutaRelativa, idVenta]);
        await notificarAdmins(`El cliente subió el comprobante del pedido #${idVenta}. Revísalo para confirmar el pago.`, idVenta);

        return res.json({ status: 'success', message: 'Comprobante subido. Tu pedido quedó pendiente de confirmación.', comprobante_pago: rutaRelativa });
    } catch (error) {
        console.error('Error al subir comprobante:', error);
        return res.status(500).json({ status: 'error', message: error.message || 'Error al subir el comprobante' });
    }
};

// 4. Confirmar Pago (Solo Admin -> pasa a 'Completada')
exports.confirmarPago = async (req, res) => {
    try {
        const idVenta = req.params.id;
        const [ventaRows] = await db.query('SELECT id_usuario, estado_venta FROM Venta WHERE id_venta = ?', [idVenta]);
        const venta = ventaRows[0];

        if (!venta) {
            return res.status(404).json({ status: 'error', message: 'Pedido no encontrado.' });
        }
        if (venta.estado_venta === 'Cancelada' || venta.estado_venta === 'Anulada') {
            return res.status(400).json({ status: 'error', message: 'El pedido fue cancelado, no se puede confirmar el pago.' });
        }
        if (venta.estado_venta === 'Completada') {
            return res.json({ status: 'success', message: 'Este pago ya estaba confirmado.' });
        }

        await db.query("UPDATE Venta SET estado_venta = 'Completada' WHERE id_venta = ?", [idVenta]);
        await notificarCliente(venta.id_usuario, `¡Tu pago del pedido #${idVenta} fue confirmado! 🎉`, idVenta);
        return res.json({ status: 'success', message: 'Pago confirmado. El pedido pasó a "Pagado".' });
    } catch (error) {
        console.error('Error al confirmar pago:', error);
        return res.status(500).json({ status: 'error', message: error.sqlMessage || 'Error al confirmar el pago' });
    }
};

exports.cancelarVenta = async (req, res) => {
    try {
        const idVenta = req.params.id;
        const [ventaRows] = await db.query('SELECT id_usuario, estado_venta FROM Venta WHERE id_venta = ?', [idVenta]);
        const venta = ventaRows[0];
        if (!venta) {
            return res.status(404).json({ status: 'error', message: 'Pedido no encontrado.' });
        }

        const esDueno = venta.id_usuario === req.usuario?.id_usuario;
        const esAdmin = req.usuario?.rol === 'admin';
        if (!esDueno && !esAdmin) {
            return res.status(403).json({ status: 'error', message: 'No puedes cancelar un pedido que no es tuyo.' });
        }

        if (venta.estado_venta === 'Completada') {
            return res.status(400).json({
                status: 'error',
                message: 'Lo sentimos 😢, el pago de este pedido ya ha sido confirmado. Por favor comunícate con nosotros al WhatsApp para gestionar la cancelación de tu pedido. ¡Gracias por tu comprensión! ❤️'
            });
        }

        if (venta.estado_venta === 'Cancelada' || venta.estado_venta === 'Anulada') {
            return res.status(400).json({ status: 'error', message: 'Este pedido ya estaba cancelado.' });
        }

        // Devolver el stock de cada producto del pedido.
        const [detalles] = await db.query('SELECT id_postre, cantidad FROM Detalle_Venta WHERE id_venta = ?', [idVenta]);
        for (const d of detalles) {
            await db.query('UPDATE Postre SET stock_total = stock_total + ? WHERE id_postre = ?', [d.cantidad, d.id_postre]);
        }

        await db.query("UPDATE Venta SET estado_venta = 'Cancelada' WHERE id_venta = ?", [idVenta]);

        // Si canceló el admin, avisar al dueño del pedido. Si canceló el
        // propio cliente, avisar a los admins (por si ya estaban revisando
        // el comprobante).
        if (esAdmin && !esDueno) {
            await notificarCliente(venta.id_usuario, `Tu pedido #${idVenta} fue cancelado por el administrador.`, idVenta);
        } else {
            await notificarAdmins(`El cliente canceló su pedido #${idVenta}.`, idVenta);
        }

        return res.json({ status: 'success', message: 'Pedido cancelado. El stock fue devuelto.' });
    } catch (error) {
        console.error('Error al cancelar venta:', error);
        return res.status(500).json({ status: 'error', message: error.sqlMessage || 'Error al cancelar el pedido' });
    }
};


exports.eliminarVentaCancelada = async (req, res) => {
    try {
        const idVenta = req.params.id;
        const [ventaRows] = await db.query('SELECT estado_venta FROM Venta WHERE id_venta = ?', [idVenta]);
        const venta = ventaRows[0];
        
        if (!venta) {
            return res.status(404).json({ status: 'error', message: 'Pedido no encontrado.' });
        }

        if (venta.estado_venta !== 'Cancelada' && venta.estado_venta !== 'Anulada') {
            return res.status(400).json({ status: 'error', message: 'Solo se pueden eliminar pedidos cancelados o anulados.' });
        }

        // En lugar de DELETE, marcar como oculto para la pantalla
        await db.query("UPDATE Venta SET visible = 0 WHERE id_venta = ?", [idVenta]);

        return res.json({ status: 'success', message: 'Pedido eliminado de la pantalla.' });
    } catch (error) {
        console.error('Error al eliminar venta cancelada:', error);
        return res.status(500).json({ status: 'error', message: error.sqlMessage || 'Error al eliminar el pedido' });
    }
};

// Se expone para poder ejecutarla también desde un job periódico en app.js,
// así los pedidos se cancelan aunque nadie abra la pantalla de Pedidos.
exports.cancelarPedidosVencidos = cancelarPedidosVencidos;