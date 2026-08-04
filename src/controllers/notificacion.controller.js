const NotificacionService = require('../services/NotificacionService');
// (Se quitó "require('../models/notificacion')": el archivo real es
// "Notificacion.js" con mayúscula y esa importación no se usaba en este
// archivo. En Linux, al ser case-sensitive, esa línea rompía el arranque
// completo del servidor con "Cannot find module".)

exports.listarPorUsuario = async (req, res) => {
  try {
    const notificaciones = await NotificacionService.obtenerPorUsuario(req.params.id_usuario);
    res.json(notificaciones);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.marcarComoLeida = async (req, res) => {
  try {
    const resultado = await NotificacionService.marcarLeida(req.params.id);
    res.json({ mensaje: 'Notificación actualizada', resultado });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};