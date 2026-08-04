const pool = require('../config/db');

class UsuarioRepository {
  async login(dni, password_hash) {
    const [rows] = await pool.query(
      `SELECT id_usuario, dni, nombre, apellido, rol, estado 
       FROM usuario 
       WHERE dni = ? AND password_hash = ? AND estado = 'activo'`,
      [dni, password_hash]
    );
    return rows[0] || null;
  }

  async listar() {
    const [rows] = await pool.query(
      `SELECT id_usuario, dni, nombre, apellido, rol, estado, fecha_creacion 
       FROM usuario 
       ORDER BY id_usuario DESC`
    );
    return rows;
  }

  async obtenerPorId(id) {
    const [rows] = await pool.query(
      `SELECT id_usuario, dni, nombre, apellido, rol, estado, fecha_creacion 
       FROM usuario 
       WHERE id_usuario = ?`,
      [id]
    );
    return rows[0] || null;
  }

  async obtenerPorDni(dni) {
    const [rows] = await pool.query(
      `SELECT id_usuario, dni FROM usuario WHERE dni = ?`,
      [dni]
    );
    return rows[0] || null;
  }

  async crear(usuarioData) {
    const [result] = await pool.query(
      `INSERT INTO usuario (dni, nombre, apellido, password_hash, rol, estado) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        usuarioData.dni,
        usuarioData.nombre,
        usuarioData.apellido,
        usuarioData.password_hash,
        usuarioData.rol || 'cliente',
        usuarioData.estado || 'activo'
      ]
    );
    return { id_usuario: result.insertId, ...usuarioData };
  }

  async cambiarEstado(id, estado) {
    const [result] = await pool.query(
      `UPDATE usuario SET estado = ? WHERE id_usuario = ?`,
      [estado, id]
    );
    return result;
  }
}

module.exports = new UsuarioRepository();