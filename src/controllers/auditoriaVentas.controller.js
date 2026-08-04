const AuditoriaVentasService = require('../services/AuditoriaVentasService');

exports.listarHistorialCambios = async (req, res) => {
  try {
    const auditoria = await AuditoriaVentasService.listar();
    res.json(auditoria);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.obtenerPorVenta = async (req, res) => {
  try {
    const cambios = await AuditoriaVentasService.obtenerPorVenta(req.params.id_venta);
    res.json(cambios);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};