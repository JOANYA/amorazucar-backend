const DetalleVentaRepository = require('../repositories/DetalleVentaRepository');
const PostreRepository = require('../repositories/PostreRepository');
const VentaRepository = require('../repositories/VentaRepository');

class DetalleVentaService {
  async agregarDetalle(detalleData) {
    const venta = await VentaRepository.obtenerPorId(detalleData.id_venta);
    if (!venta) {
      throw new Error('La venta especificada no existe');
    }

    const postre = await PostreRepository.obtenerPorId(detalleData.id_postre);
    if (!postre) {
      throw new Error('El postre a agregar no existe');
    }

    if (postre.stock_total < detalleData.cantidad) {
      throw new Error(`Stock insuficiente para el postre: ${postre.nombre}`);
    }

    // Ejecuta sp_AgregarDetalleVenta
    return DetalleVentaRepository.agregarDetalle(detalleData);
  }

  async obtenerPorVenta(idVenta) {
    return DetalleVentaRepository.obtenerPorVenta(idVenta);
  }
}

module.exports = new DetalleVentaService();