const pool = require('../config/db');

class NotificacionRepository {
  async obtenerPorUsuario(idUsuario) {
    const [rows] = await pool.query(
      `SELECT * FROM notificacion 
       WHERE id_usuario = ? 
       ORDER BY fecha_envio DESC`,
      [idUsuario]
    );
    return rows;
  }

  async obtenerPorId(idNotificacion) {
    const [rows] = await pool.query(
      `SELECT * FROM notificacion WHERE id_notificacion = ?`,
      [idNotificacion]
    );
    return rows[0] || null;
  }

  async marcarLeida(idNotificacion) {
    const [result] = await pool.query(
      `UPDATE notificacion SET leido = TRUE WHERE id_notificacion = ?`,
      [idNotificacion]
    );
    return result;
  }

  async crear(notificacionData) {
    const [result] = await pool.query(
      `INSERT INTO notificacion (id_usuario, mensaje, id_venta, leido) 
       VALUES (?, ?, ?, FALSE)`,
      [
        notificacionData.id_usuario,
        notificacionData.mensaje,
        notificacionData.id_venta || null
      ]
    );
    return { id_notificacion: result.insertId, ...notificacionData };
  }
}

module.exports = new NotificacionRepository();