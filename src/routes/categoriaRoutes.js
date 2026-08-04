const express = require('express');
const router = express.Router();

const categoriaController = require('../controllers/categoria.controller');
const { verificarToken, soloPastelero } = require('../middlewares/auth');

router.get('/', categoriaController.listarCategorias);
router.post('/', verificarToken, soloPastelero, categoriaController.crearCategoria);
router.put('/:id', verificarToken, soloPastelero, categoriaController.actualizarCategoria);

module.exports = router;