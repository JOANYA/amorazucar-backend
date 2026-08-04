const NotificacionRepository = require('../repositories/NotificacionRepository');

class NotificacionService {
  async obtenerPorUsuario(idUsuario) {
    return NotificacionRepository.obtenerPorUsuario(idUsuario);
  }

  async marcarLeida(idNotificacion) {
    const notificacion = await NotificacionRepository.obtenerPorId(idNotificacion);
    if (!notificacion) {
      throw new Error('La notificación no existe');
    }
    return NotificacionRepository.marcarLeida(idNotificacion);
  }

  async crearNotificacion(idUsuario, mensaje, idVenta = null) {
    return NotificacionRepository.crear({
      id_usuario: idUsuario,
      mensaje,
      id_venta: idVenta
    });
  }
}

module.exports = new NotificacionService();