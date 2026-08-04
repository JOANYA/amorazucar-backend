const express = require('express');
const router = express.Router();

const auditoriaVentasController = require('../controllers/auditoriaVentas.controller');
const { verificarToken, soloAdmin } = require('../middlewares/auth');

router.use(verificarToken, soloAdmin);

router.get('/', auditoriaVentasController.listarHistorialCambios);
router.get('/venta/:id_venta', auditoriaVentasController.obtenerPorVenta);

module.exports = router;