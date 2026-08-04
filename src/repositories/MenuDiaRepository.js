const pool = require('../config/db');

class MenuDiaRepository {
  async obtenerMenuHoy() {
    const [rows] = await pool.query(
      `SELECT m.id_menu_dia, m.dia_semana, m.stock_programado, 
              p.id_postre, p.nombre AS nombre_postre, p.precio_actual, p.descripcion
       FROM menu_dia m
       INNER JOIN postre p ON m.id_postre = p.id_postre
       WHERE m.estado = 'activo'`
    );
    return rows;
  }

  async listarPorDia(diaSemana) {
    const [rows] = await pool.query(
      `SELECT m.id_menu_dia, m.dia_semana, m.stock_programado, m.estado,
              p.id_postre, p.nombre AS nombre_postre, p.precio_actual
       FROM menu_dia m
       INNER JOIN postre p ON m.id_postre = p.id_postre
       WHERE m.dia_semana = ?`,
      [diaSemana]
    );
    return rows;
  }

  async programar(menuData) {
    const [result] = await pool.query(
      `INSERT INTO menu_dia (id_postre, dia_semana, stock_programado, estado) 
       VALUES (?, ?, ?, ?)`,
      [
        menuData.id_postre,
        menuData.dia_semana,
        menuData.stock_programado,
        menuData.estado || 'activo'
      ]
    );
    return { id_menu_dia: result.insertId, ...menuData };
  }
}

module.exports = new MenuDiaRepository();