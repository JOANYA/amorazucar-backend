const express = require('express');
const router = express.Router();

const usuarioController = require('../controllers/usuario.controller');
const { verificarToken, soloAdmin } = require('../middlewares/auth');

// 🌐 Rutas Públicas (Cualquiera puede usarlas desde Postman sin Token)
router.post('/login', usuarioController.login);
router.post('/registro', usuarioController.crearUsuario); // 👈 Agrega esta línea

// 🔒 Rutas Protegidas (Requieren Token de Admin)
router.get('/', verificarToken, soloAdmin, usuarioController.listarUsuarios);
router.post('/', verificarToken, soloAdmin, usuarioController.crearUsuario);
router.get('/:id', verificarToken, usuarioController.obtenerPorId);
router.put('/:id/estado', verificarToken, soloAdmin, usuarioController.actualizarEstado);

module.exports = router;