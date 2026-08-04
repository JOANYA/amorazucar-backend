const CategoriaRepository = require('../repositories/CategoriaRepository');
const Categoria = require('../models/Categoria');

class CategoriaService {
  async listar() {
    return CategoriaRepository.listar();
  }

  async crear(data) {
    if (!data.nombre) {
      throw new Error('El nombre de la categoría es requerido');
    }
    const categoria = new Categoria(data);
    return CategoriaRepository.crear(categoria);
  }

  async actualizar(categoriaData) {
    const existe = await CategoriaRepository.obtenerPorId(categoriaData.id_categoria);
    if (!existe) {
      throw new Error('La categoría especificada no existe');
    }
    return CategoriaRepository.actualizar(categoriaData);
  }
}

module.exports = new CategoriaService();