const PostreRepository = require('../repositories/PostreRepository');
const CategoriaRepository = require('../repositories/CategoriaRepository');
const Postre = require('../models/Postre');

class PostreService {
  async listar() {
    return PostreRepository.listar();
  }

  async obtenerPorId(id) {
    const postre = await PostreRepository.obtenerPorId(id);
    if (!postre) {
      throw new Error('Postre no encontrado en el catálogo');
    }
    return postre;
  }

  async crear(data) {
    const categoria = await CategoriaRepository.obtenerPorId(data.id_categoria);
    if (!categoria) {
      throw new Error('La categoría asignada al postre no existe');
    }

    if (!data.precio_actual || data.precio_actual <= 0) {
      throw new Error('El precio del postre debe ser mayor a 0');
    }

    const postre = new Postre(data);
    return PostreRepository.crear(postre);
  }

  async actualizarStock(id_postre, nuevoStock) {
    if (nuevoStock < 0) {
      throw new Error('El stock no puede ser negativo');
    }
    const postre = await PostreRepository.obtenerPorId(id_postre);
    if (!postre) {
      throw new Error('Postre no existe');
    }
    return PostreRepository.actualizarStock(id_postre, nuevoStock);
  }

  async actualizar(id_postre, data) {
    const postre = await PostreRepository.obtenerPorId(id_postre);
    if (!postre) {
      throw new Error('Postre no existe');
    }
    if (data.id_categoria) {
      const categoria = await CategoriaRepository.obtenerPorId(data.id_categoria);
      if (!categoria) {
        throw new Error('La categoría asignada al postre no existe');
      }
    }
    if (!data.precio_actual || data.precio_actual <= 0) {
      throw new Error('El precio del postre debe ser mayor a 0');
    }
    return PostreRepository.actualizar(id_postre, data);
  }

  async eliminar(id_postre) {
    const postre = await PostreRepository.obtenerPorId(id_postre);
    if (!postre) {
      throw new Error('Postre no existe');
    }
    // Llama al repository que actualiza el campo activo = 0
    return PostreRepository.eliminar(id_postre);
  }

  async actualizarImagen(id_postre, rutaImagen) {
    const postre = await PostreRepository.obtenerPorId(id_postre);
    if (!postre) {
      throw new Error('Postre no existe');
    }
    return PostreRepository.actualizarImagen(id_postre, rutaImagen);
  }
}

module.exports = new PostreService();