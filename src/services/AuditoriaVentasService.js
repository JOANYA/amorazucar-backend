const AuditoriaVentasRepository = require('../repositories/AuditoriaVentasRepository');

class AuditoriaVentasService {
  async listar() {
    return AuditoriaVentasRepository.listar();
  }

  async obtenerPorVenta(idVenta) {
    return AuditoriaVentasRepository.obtenerPorVenta(idVenta);
  }
}

module.exports = new AuditoriaVentasService();