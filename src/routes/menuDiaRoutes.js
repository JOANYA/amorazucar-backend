const express = require('express');
const router = express.Router();

const menuDiaController = require('../controllers/menuDia.controller');
const { verificarToken, soloPastelero } = require('../middlewares/auth');

router.get('/hoy', menuDiaController.obtenerMenuHoy);
router.get('/dia/:dia', menuDiaController.listarPorDia);

router.post('/', verificarToken, soloPastelero, menuDiaController.programarMenu);

module.exports = router;