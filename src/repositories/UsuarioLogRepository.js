const pool = require('../config/db');

class UsuarioLogRepository {
  async listar() {
    const [rows] = await pool.query(
      `SELECT l.id_log, l.accion, l.dispositivo, l.ip, l.navegador, l.fecha_hora,
              u.nombre, u.apellido, u.rol
       FROM usuario_log l
       INNER JOIN usuario u ON l.id_usuario = u.id_usuario
       ORDER BY l.fecha_hora DESC`
    );
    return rows;
  }

  async obtenerPorUsuario(idUsuario) {
    const [rows] = await pool.query(
      `SELECT * FROM usuario_log WHERE id_usuario = ? ORDER BY fecha_hora DESC`,
      [idUsuario]
    );
    return rows;
  }

  async registrarLog(logData) {
    const [result] = await pool.query(
      `INSERT INTO usuario_log (id_usuario, accion, dispositivo, ip, navegador) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        logData.id_usuario,
        logData.accion,
        logData.dispositivo,
        logData.ip,
        logData.navegador
      ]
    );
    return { id_log: result.insertId, ...logData };
  }
}

module.exports = new UsuarioLogRepository();