const MenuDiaService = require('../services/MenuDiaService');
const MenuDia = require('../models/MenuDia');

exports.obtenerMenuHoy = async (req, res) => {
  try {
    // Consume la vista SQL vw_MenuHoy
    const menuHoy = await MenuDiaService.obtenerMenuHoy();
    res.json(menuHoy);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.programarMenu = async (req, res) => {
  try {
    const menu = new MenuDia(req.body);
    const resultado = await MenuDiaService.programar(menu);
    res.status(201).json({ mensaje: 'Postre asignado al menú del día', resultado });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.listarPorDia = async (req, res) => {
  try {
    const { dia } = req.params;
    const menu = await MenuDiaService.listarPorDia(dia);
    res.json(menu);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};