import PostreService from '../services/PostreService.js';
import Postre from '../models/Postre.js';

export const listarPostres = async (req, res) => {
  try {
    const postres = await PostreService.listar();
    res.json(postres);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const crearPostre = async (req, res) => {
  try {
    const nuevoPostre = new Postre(req.body);
    const resultado = await PostreService.crear(nuevoPostre);
    res.status(201).json({ mensaje: 'Postre registrado en catálogo', resultado });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const obtenerPorId = async (req, res) => {
  try {
    const postre = await PostreService.obtenerPorId(req.params.id);
    if (!postre) return res.status(404).json({ mensaje: 'Postre no encontrado' });
    res.json(postre);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const actualizarStock = async (req, res) => {
  try {
    const { stock_total } = req.body;
    const resultado = await PostreService.actualizarStock(req.params.id, stock_total);
    res.json({ mensaje: 'Stock actualizado', resultado });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const actualizarPostre = async (req, res) => {
  try {
    const resultado = await PostreService.actualizar(req.params.id, req.body);
    res.json({ mensaje: 'Postre actualizado', resultado });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const eliminarPostre = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await PostreService.eliminar(id);
    return res.status(200).json({ message: 'Postre desactivado del catálogo correctamente', resultado });
  } catch (error) {
    console.error('Error al eliminar postre:', error);
    return res.status(500).json({ message: error.message || 'Error interno del servidor' });
  }
};

export const subirImagenPostre = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Debes adjuntar una imagen del postre.' });
    }
    const rutaRelativa = `/images/postres/${req.file.filename}`;
    const resultado = await PostreService.actualizarImagen(req.params.id, rutaRelativa);
    res.json({ mensaje: 'Imagen del postre actualizada', imagen: rutaRelativa, resultado });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};