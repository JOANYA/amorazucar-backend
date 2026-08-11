const pool = require('../config/db');

class AuditoriaVentasRepository {
  async listar() {
    const [rows] = await pool.query(
      `SELECT a.id_auditoria, a.id_venta, a.estado_anterior, a.estado_nuevo, a.fecha_cambio,
              u.nombre AS modificado_por_nombre, u.apellido AS modificado_por_apellido
       FROM auditoria_ventas a
       INNER JOIN usuario u ON a.id_usuario_cambio = u.id_usuario
       ORDER BY a.fecha_cambio DESC`
    );
    return rows;
  }

  async obtenerPorVenta(idVenta) {
    const [rows] = await pool.query(
      `SELECT a.*, u.nombre AS usuario_nombre, u.apellido AS usuario_apellido
       FROM auditoria_ventas a
       INNER JOIN usuario u ON a.id_usuario_cambio = u.id_usuario
       WHERE a.id_venta = ?
       ORDER BY a.fecha_cambio DESC`,
      [idVenta]
    );
    return rows;
  }
}

module.exports = new AuditoriaVentasRepository();