const mysql = require('mysql2/promise');

// Solo cargar dotenv si estamos en local (si no existe process.env.DB_HOST ya definido)
if (!process.env.DB_HOST) {
  require('dotenv').config();
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'defaultdb',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false
  }
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