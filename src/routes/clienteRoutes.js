const express = require('express');
const router = express.Router();

const clienteController = require('../controllers/cliente.controller');
const { verificarToken, soloVentas } = require('../middlewares/auth');

router.use(verificarToken);

router.get('/', clienteController.listarClientes);
router.get('/documento/:numDocumento', clienteController.obtenerPorDocumento);
router.post('/', soloVentas, clienteController.crearCliente);
router.put('/:id', soloVentas, clienteController.actualizarCliente);

module.exports = router;