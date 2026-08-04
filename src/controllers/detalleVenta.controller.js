const DetalleVentaService = require('../services/DetalleVentaService');
const DetalleVenta = require('../models/DetalleVenta');

exports.agregarDetalle = async (req, res) => {
  try {
    const detalle = new DetalleVenta({
      id_venta: req.params.id_venta,
      id_postre: req.body.id_postre,
      cantidad: req.body.cantidad
    });

    // Ejecuta sp_AgregarDetalleVenta (Congela precio y descuenta stock)
    const resultado = await DetalleVentaService.agregarDetalle(detalle);
    res.status(201).json({ mensaje: 'Postre agregado a la venta', resultado });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.listarDetallesPorVenta = async (req, res) => {
  try {
    const detalles = await DetalleVentaService.obtenerPorVenta(req.params.id_venta);
    res.json(detalles);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};