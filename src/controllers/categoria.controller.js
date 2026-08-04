const CategoriaService = require('../services/CategoriaService');
const Categoria = require('../models/Categoria');

exports.listarCategorias = async (req, res) => {
  try {
    const categorias = await CategoriaService.listar();
    res.json(categorias);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.crearCategoria = async (req, res) => {
  try {
    const nuevaCategoria = new Categoria(req.body);
    const resultado = await CategoriaService.crear(nuevaCategoria);
    res.status(201).json({ mensaje: 'Categoría creada', resultado });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.actualizarCategoria = async (req, res) => {
  try {
    const categoria = new Categoria({ ...req.body, id_categoria: req.params.id });
    const resultado = await CategoriaService.actualizar(categoria);
    res.json({ mensaje: 'Categoría actualizada', resultado });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};