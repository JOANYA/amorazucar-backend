const pool = require('../config/db');

class VentaRepository {
  async listarVentasRealizadas() {
    const [rows] = await pool.query(
      `SELECT v.id_venta, v.tipo_comprobante, v.num_comprobante, v.fecha_venta, v.total, v.estado_venta,
              c.nombre_razon_social AS nombre_cliente,
              u.nombre AS nombre_vendedor, u.apellido AS apellido_vendedor
       FROM venta v
       LEFT JOIN cliente c ON v.id_cliente = c.id_cliente
       INNER JOIN usuario u ON v.id_usuario = u.id_usuario
       ORDER BY v.fecha_venta DESC`
    );
    return rows;
  }

  // Llama al Stored Procedure: sp_RegistrarVenta
  async crearVenta(ventaData) {
    const [rows] = await pool.query(
      'CALL sp_RegistrarVenta(?, ?, ?, ?)',
      [
        ventaData.id_cliente || null,
        ventaData.id_usuario,
        ventaData.tipo_comprobante,
        ventaData.num_comprobante
      ]
    );
    return rows[0];
  }

  async obtenerPorId(id) {
    const [rows] = await pool.query(
      `SELECT v.*, c.nombre_razon_social, c.num_documento, u.nombre AS vendedor
       FROM venta v
       LEFT JOIN cliente c ON v.id_cliente = c.id_cliente
       INNER JOIN usuario u ON v.id_usuario = u.id_usuario
       WHERE v.id_venta = ?`,
      [id]
    );
    return rows[0] || null;
  }

  async listarPorCliente(idCliente) {
    const [rows] = await pool.query(
      `SELECT * FROM venta WHERE id_cliente = ? ORDER BY fecha_venta DESC`,
      [idCliente]
    );
    return rows;
  }

  // Llama al Stored Procedure: sp_AnularVenta
  async anularVenta(idVenta, idUsuarioAdmin) {
    const [rows] = await pool.query(
      'CALL sp_AnularVenta(?, ?)',
      [idVenta, idUsuarioAdmin]
    );
    return rows;
  }
}

module.exports = new VentaRepository();