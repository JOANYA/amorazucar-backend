const express = require('express');
const router = express.Router();

const postreController = require('../controllers/postre.controller');
const { verificarToken, soloPastelero } = require('../middlewares/auth');
const { uploadImagenPostre } = require('../middlewares/upload');

router.get('/', postreController.listarPostres);
router.get('/:id', postreController.obtenerPorId);

router.post('/', verificarToken, soloPastelero, postreController.crearPostre);
router.put('/:id/stock', verificarToken, soloPastelero, postreController.actualizarStock);
router.put('/:id', verificarToken, soloPastelero, postreController.actualizarPostre);
router.post('/:id/imagen', verificarToken, soloPastelero, uploadImagenPostre.single('imagen'), postreController.subirImagenPostre);
router.delete('/:id', verificarToken, soloPastelero, postreController.eliminarPostre);

module.exports = router;