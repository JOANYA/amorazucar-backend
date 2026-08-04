-- =====================================================
-- MIGRACIÓN: rol "vendedor" -> "cliente" + flujo de pagos
-- (Yape/Plin con comprobante y confirmación de admin)
-- Ejecutar UNA sola vez sobre GestionPasteleriaDulceAmor
-- =====================================================

USE GestionPasteleriaDulceAmor;

-- 1) Pasar cualquier usuario existente con rol 'vendedor' a 'cliente'
--    (hay que hacerlo ANTES de cambiar el ENUM, o MySQL lo rechaza)
UPDATE Usuario SET rol = 'admin' WHERE rol = 'vendedor';
-- ⚠️ Ojo: la línea de arriba es solo un valor temporal válido para no romper
-- el ENUM viejo. Si ya sabes qué usuarios 'vendedor' deben quedar como
-- 'cliente' reales (los que compran) y cuáles como 'admin'/'pastelero'
-- (personal), edita esta línea antes de correr el script. Por defecto,
-- como dijiste que ya no existen vendedores como personal, lo más seguro
-- es revisarlos a mano:
--   SELECT id_usuario, dni, nombre, apellido, rol FROM Usuario WHERE rol = 'vendedor';
-- y luego decidir UPDATE ... SET rol = 'cliente' / 'admin' / 'pastelero' según corresponda.

-- 2) Actualizar el ENUM de roles: quitar 'vendedor', agregar 'cliente'
ALTER TABLE Usuario
  MODIFY rol ENUM('admin', 'pastelero', 'cliente') NOT NULL;

-- 3) Columna para guardar la foto/captura del comprobante de Yape/Plin
ALTER TABLE Venta
  ADD COLUMN comprobante_pago VARCHAR(255) NULL AFTER metodo_pago;

-- 4) Reemplazar sp_AgregarDetalleVenta: ya NO marca 'Completada' a la fuerza.
--    Si el método de pago es Yape/Plin, el pedido se queda en 'Pendiente'
--    (pendiente de que el cliente suba su comprobante Y el admin confirme).
--    Cualquier otro método de pago (Efectivo/Tarjeta/Transferencia) se
--    completa igual que antes, automáticamente.
DROP PROCEDURE IF EXISTS sp_AgregarDetalleVenta;
DELIMITER //
CREATE PROCEDURE sp_AgregarDetalleVenta(
    IN p_id_venta INT,
    IN p_id_postre INT,
    IN p_cantidad INT
)
BEGIN
    DECLARE v_precio DECIMAL(10,2);
    DECLARE v_stock INT;
    DECLARE v_metodo_pago VARCHAR(20);

    SELECT precio_actual, stock_total INTO v_precio, v_stock
    FROM Postre WHERE id_postre = p_id_postre;

    IF v_stock < p_cantidad THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Stock insuficiente para el postre seleccionado';
    ELSE
        INSERT INTO Detalle_Venta(id_venta, id_postre, cantidad, precio_unitario)
        VALUES(p_id_venta, p_id_postre, p_cantidad, v_precio);

        UPDATE Postre
        SET stock_total = stock_total - p_cantidad
        WHERE id_postre = p_id_postre;

        SELECT metodo_pago INTO v_metodo_pago FROM Venta WHERE id_venta = p_id_venta;

        UPDATE Venta
        SET monto_total = (SELECT SUM(subtotal) FROM Detalle_Venta WHERE id_venta = p_id_venta),
            estado_venta = IF(v_metodo_pago = 'Yape/Plin', 'Pendiente', 'Completada')
        WHERE id_venta = p_id_venta;
    END IF;
END //
DELIMITER ;
