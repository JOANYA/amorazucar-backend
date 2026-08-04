const express = require('express');
const router = express.Router();

const usuarioLogController = require('../controllers/usuarioLog.controller');
const { verificarToken, soloAdmin } = require('../middlewares/auth');

router.use(verificarToken, soloAdmin);

router.get('/', usuarioLogController.listarLogs);
router.get('/usuario/:id_usuario', usuarioLogController.listarPorUsuario);

module.exports = router;