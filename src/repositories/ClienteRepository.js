const pool = require('../config/db');

class ClienteRepository {
  async listar() {
    const [rows] = await pool.query(
      `SELECT id_cliente, tipo_documento, num_documento, nombre_razon_social, direccion, telefono, email 
       FROM cliente 
       ORDER BY nombre_razon_social ASC`
    );
    return rows;
  }

  async buscarPorDocumento(numDocumento) {
    const [rows] = await pool.query(
      `SELECT * FROM cliente WHERE num_documento = ?`,
      [numDocumento]
    );
    return rows[0] || null;
  }

  async obtenerPorId(id) {
    const [rows] = await pool.query(
      `SELECT * FROM cliente WHERE id_cliente = ?`,
      [id]
    );
    return rows[0] || null;
  }

  async crear(clienteData) {
    const [result] = await pool.query(
      `INSERT INTO cliente (tipo_documento, num_documento, nombre_razon_social, direccion, telefono, email) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        clienteData.tipo_documento,
        clienteData.num_documento,
        clienteData.nombre_razon_social,
        clienteData.direccion,
        clienteData.telefono,
        clienteData.email
      ]
    );
    return { id_cliente: result.insertId, ...clienteData };
  }

  async actualizar(clienteData) {
    const [result] = await pool.query(
      `UPDATE cliente 
       SET tipo_documento = ?, num_documento = ?, nombre_razon_social = ?, direccion = ?, telefono = ?, email = ?
       WHERE id_cliente = ?`,
      [
        clienteData.tipo_documento,
        clienteData.num_documento,
        clienteData.nombre_razon_social,
        clienteData.direccion,
        clienteData.telefono,
        clienteData.email,
        clienteData.id_cliente
      ]
    );
    return result;
  }
}

module.exports = new ClienteRepository();