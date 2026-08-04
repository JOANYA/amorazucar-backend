const UsuarioLogService = require('../services/UsuarioLogService');

exports.listarLogs = async (req, res) => {
  try {
    const logs = await UsuarioLogService.listar();
    res.json(logs);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.listarPorUsuario = async (req, res) => {
  try {
    const logs = await UsuarioLogService.obtenerPorUsuario(req.params.id_usuario);
    res.json(logs);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};