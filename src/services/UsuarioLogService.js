const UsuarioLogRepository = require('../repositories/UsuarioLogRepository');

class UsuarioLogService {
  async listar() {
    return UsuarioLogRepository.listar();
  }

  async obtenerPorUsuario(idUsuario) {
    return UsuarioLogRepository.obtenerPorUsuario(idUsuario);
  }

  async registrarLog(idUsuario, accion, dispositivo, ip, navegador) {
    return UsuarioLogRepository.registrarLog({
      id_usuario: idUsuario,
      accion,
      dispositivo,
      ip,
      navegador
    });
  }
}

module.exports = new UsuarioLogService();