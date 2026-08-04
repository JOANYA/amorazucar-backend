const pool = require('../config/db');

class PostreRepository {
  async listar() {
    const [rows] = await pool.query(
      `SELECT p.id_postre, p.nombre, p.descripcion, p.precio_actual, p.stock_total, p.estado, p.imagen,
              c.id_categoria, c.nombre AS nombre_categoria
       FROM postre p
       INNER JOIN categoria c ON p.id_categoria = c.id_categoria
       ORDER BY p.nombre ASC`
    );
    return rows;
  }

  async obtenerPorId(id) {
    const [rows] = await pool.query(
      `SELECT p.*, c.nombre AS nombre_categoria 
       FROM postre p
       INNER JOIN categoria c ON p.id_categoria = c.id_categoria
       WHERE p.id_postre = ?`,
      [id]
    );
    return rows[0] || null;
  }

  async crear(postreData) {
    const [result] = await pool.query(
      `INSERT INTO postre (id_categoria, nombre, descripcion, precio_actual, stock_total, estado) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        postreData.id_categoria,
        postreData.nombre,
        postreData.descripcion,
        postreData.precio_actual,
        postreData.stock_total || 0,
        postreData.estado || 'Disponible'
      ]
    );
    return { id_postre: result.insertId, ...postreData };
  }

  async actualizarStock(id_postre, nuevoStock) {
    const [result] = await pool.query(
      `UPDATE postre SET stock_total = ? WHERE id_postre = ?`,
      [nuevoStock, id_postre]
    );
    return result;
  }

  async actualizar(id_postre, postreData) {
    const [result] = await pool.query(
      `UPDATE postre SET id_categoria = ?, nombre = ?, descripcion = ?, precio_actual = ?, stock_total = ?, estado = ?
       WHERE id_postre = ?`,
      [
        postreData.id_categoria,
        postreData.nombre,
        postreData.descripcion,
        postreData.precio_actual,
        postreData.stock_total,
        postreData.estado || 'Disponible',
        id_postre
      ]
    );
    return result;
  }

  async eliminar(id_postre) {
    // Eliminación lógica: cambia el estado a 'Inactivo' para no romper
    // las claves foráneas en detalle_venta
    const [result] = await pool.query(
      `UPDATE postre SET estado = 'Inactivo' WHERE id_postre = ?`,
      [id_postre]
    );
    return result;
  }

  async actualizarImagen(id_postre, rutaImagen) {
    const [result] = await pool.query(
      `UPDATE postre SET imagen = ? WHERE id_postre = ?`,
      [rutaImagen, id_postre]
    );
    return result;
  }
}

module.exports = new PostreRepository();