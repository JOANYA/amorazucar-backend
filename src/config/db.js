const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'defaultdb',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // ⚠️ Configuración SSL requerida para Aiven Cloud MySQL:
  ssl: process.env.DB_HOST ? { rejectUnauthorized: false } : false
});

// Prueba de conexión
pool.getConnection()
  .then(connection => {
    console.log('✅ Conexión exitosa a MySQL: gestionpasteleriadulceamor');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Error al conectar a la base de datos MySQL:', err.message);
  });

module.exports = pool;