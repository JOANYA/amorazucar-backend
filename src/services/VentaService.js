const VentaRepository = require('../repositories/VentaRepository');
const UsuarioRepository = require('../repositories/UsuarioRepository');

class VentaService {
  async listarVentasRealizadas() {
    return VentaRepository.listarVentasRealizadas();
  }

  async crearVenta(ventaData) {
    const usuario = await UsuarioRepository.obtenerPorId(ventaData.id_usuario);
    if (!usuario) {
      throw new Error('El usuario que registra la venta no existe');
    }

    // Ejecuta el Stored Procedure sp_RegistrarVenta
    return VentaRepository.crearVenta(ventaData);
  }

  async obtenerVentaPorId(id) {
    const venta = await VentaRepository.obtenerPorId(id);
    if (!venta) {
      throw new Error('Venta no encontrada');
    }
    return venta;
  }

  async listarPorCliente(idCliente) {
    return VentaRepository.listarPorCliente(idCliente);
  }

  async anularVenta(idVenta, idUsuarioAdmin) {
    const usuarioAdmin = await UsuarioRepository.obtenerPorId(idUsuarioAdmin);
    if (!usuarioAdmin || usuarioAdmin.rol !== 'admin') {
      throw new Error('Solo un Administrador puede anular una venta');
    }

    // Ejecuta el Stored Procedure sp_AnularVenta
    return VentaRepository.anularVenta(idVenta, idUsuarioAdmin);
  }
}

module.exports = new VentaService();