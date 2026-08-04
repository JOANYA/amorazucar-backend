const express = require('express');
const router = express.Router();

const detalleVentaController = require('../controllers/detalleVenta.controller');
const { verificarToken, soloVentas } = require('../middlewares/auth');

router.use(verificarToken);

router.get('/venta/:id_venta', detalleVentaController.listarDetallesPorVenta);
router.post('/venta/:id_venta', soloVentas, detalleVentaController.agregarDetalle);

module.exports = router;