const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/venta.controller');
const auth = require('../middlewares/auth');
const { uploadComprobante } = require('../middlewares/upload');

const verificarToken = auth.verificarToken || ((req, res, next) => next());
const soloAdmin = auth.soloAdmin || ((req, res, next) => next());

router.use(verificarToken);

router.get('/', ventaController.listarVentas);
router.post('/', ventaController.registrarVenta);
router.post('/:id/comprobante', uploadComprobante.single('comprobante'), ventaController.subirComprobante);
router.post('/:id/pagar-tarjeta', ventaController.pagarConTarjeta);
router.put('/:id/confirmar-pago', soloAdmin, ventaController.confirmarPago);
router.delete('/:id', ventaController.cancelarVenta);

// Nueva ruta para que el admin elimine los cancelados de la pantalla
router.delete('/:id/eliminar-cancelado', soloAdmin, ventaController.eliminarVentaCancelada);

module.exports = router;