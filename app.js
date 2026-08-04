var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');                          // 👈 AGREGAR (línea nueva, junto a los demás require)

// 🔌 Conexión a la Base de Datos
require('./src/config/db');

// 📦 Importación de Rutas de la Pastelería
const usuarioRoutes = require('./src/routes/usuarioRoutes');
const clienteRoutes = require('./src/routes/clienteRoutes');
const categoriaRoutes = require('./src/routes/categoriaRoutes');
const postreRoutes = require('./src/routes/postreRoutes');
const menuDiaRoutes = require('./src/routes/menuDiaRoutes');
const ventaRoutes = require('./src/routes/ventaRoutes');
const detalleVentaRoutes = require('./src/routes/detalleVentaRoutes');
const usuarioLogRoutes = require('./src/routes/usuarioLogRoutes');
const auditoriaVentasRoutes = require('./src/routes/auditoriaVentasRoutes');
const notificacionRoutes = require('./src/routes/notificacionRoutes');
const ventaController = require('./src/controllers/venta.controller');

var app = express();

// ⚙️ Middlewares Base
app.use(logger('dev'));
app.use(cors());                                      // 👈 AGREGAR (antes de las rutas /api/...)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 🚀 Endpoints Base de la API
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/postres', postreRoutes);
app.use('/api/menu-dia', menuDiaRoutes);
app.use('/api/ventas', ventaRoutes);
app.use('/api/detalles-venta', detalleVentaRoutes);
app.use('/api/logs', usuarioLogRoutes);
app.use('/api/auditoria-ventas', auditoriaVentasRoutes);
app.use('/api/notificaciones', notificacionRoutes);

// ⏱️ Job en segundo plano: cada 30 minutos revisa y cancela automáticamente
// los pedidos "Pendiente" que llevan demasiado tiempo sin confirmación de
// pago (también se ejecuta al listar pedidos, esto es solo un respaldo para
// que se actualicen aunque nadie tenga la pantalla abierta).
setInterval(() => {
    ventaController.cancelarPedidosVencidos();
}, 30 * 60 * 1000);

module.exports = app;