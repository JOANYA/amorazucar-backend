const express = require('express');
const router = express.Router();

const notificacionController = require('../controllers/notificacion.controller');
const { verificarToken } = require('../middlewares/auth');

router.use(verificarToken);

router.get('/usuario/:id_usuario', notificacionController.listarPorUsuario);
router.put('/:id/leer', notificacionController.marcarComoLeida);

module.exports = router;