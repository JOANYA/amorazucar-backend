const pool = require('../config/db');

class AuditoriaVentasRepository {
  async listar() {
    const [rows] = await pool.query(
      `SELECT a.id_auditoria, a.id_venta, a.campo_modificado, a.valor_anterior, a.valor_nuevo, a.fecha_modificacion,
              u.nombre AS modificado_por_nombre, u.apellido AS modificado_por_apellido
       FROM auditoria_ventas a
       INNER JOIN usuario u ON a.id_usuario = u.id_usuario
       ORDER BY a.fecha_modificacion DESC`
    );
    return rows;
  }

  async obtenerPorVenta(idVenta) {
    const [rows] = await pool.query(
      `SELECT a.*, u.nombre AS usuario_nombre, u.apellido AS usuario_apellido
       FROM auditoria_ventas a
       INNER JOIN usuario u ON a.id_usuario = u.id_usuario
       WHERE a.id_venta = ?
       ORDER BY a.fecha_modificacion DESC`,
      [idVenta]
    );
    return rows;
  }
}

module.exports = new AuditoriaVentasRepository();