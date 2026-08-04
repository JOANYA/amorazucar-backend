const pool = require('../config/db');

class DetalleVentaRepository {
  // Llama al Stored Procedure: sp_AgregarDetalleVenta
  async agregarDetalle(detalleData) {
    const [rows] = await pool.query(
      'CALL sp_AgregarDetalleVenta(?, ?, ?)',
      [
        detalleData.id_venta,
        detalleData.id_postre,
        detalleData.cantidad
      ]
    );
    return rows;
  }

  async obtenerPorVenta(idVenta) {
    const [rows] = await pool.query(
      `SELECT dv.id_detalle, dv.cantidad, dv.precio_unitario, dv.subtotal,
              p.nombre AS nombre_postre, p.descripcion
       FROM detalle_venta dv
       INNER JOIN postre p ON dv.id_postre = p.id_postre
       WHERE dv.id_venta = ?`,
      [idVenta]
    );
    return rows;
  }
}

module.exports = new DetalleVentaRepository();