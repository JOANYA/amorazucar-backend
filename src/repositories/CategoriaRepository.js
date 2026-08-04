const pool = require('../config/db');

class CategoriaRepository {
  async listar() {
    const [rows] = await pool.query(
      `SELECT id_categoria, nombre, descripcion FROM categoria ORDER BY nombre ASC`
    );
    return rows;
  }

  async obtenerPorId(id) {
    const [rows] = await pool.query(
      `SELECT * FROM categoria WHERE id_categoria = ?`,
      [id]
    );
    return rows[0] || null;
  }

  async crear(categoriaData) {
    const [result] = await pool.query(
      `INSERT INTO categoria (nombre, descripcion) VALUES (?, ?)`,
      [categoriaData.nombre, categoriaData.descripcion]
    );
    return { id_categoria: result.insertId, ...categoriaData };
  }

  async actualizar(categoriaData) {
    const [result] = await pool.query(
      `UPDATE categoria SET nombre = ?, descripcion = ? WHERE id_categoria = ?`,
      [categoriaData.nombre, categoriaData.descripcion, categoriaData.id_categoria]
    );
    return result;
  }
}

module.exports = new CategoriaRepository();