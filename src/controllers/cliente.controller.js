const ClienteService = require('../services/ClienteService');
const Cliente = require('../models/Cliente');

exports.listarClientes = async (req, res) => {
  try {
    const clientes = await ClienteService.listar();
    res.json(clientes);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.crearCliente = async (req, res) => {
  try {
    const nuevoCliente = new Cliente(req.body);
    const resultado = await ClienteService.crear(nuevoCliente);
    res.status(201).json({ mensaje: 'Cliente registrado', resultado });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.obtenerPorDocumento = async (req, res) => {
  try {
    const cliente = await ClienteService.buscarPorDocumento(req.params.numDocumento);
    if (!cliente) return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    res.json(cliente);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.actualizarCliente = async (req, res) => {
  try {
    const clienteData = new Cliente({ ...req.body, id_cliente: req.params.id });
    const resultado = await ClienteService.actualizar(clienteData);
    res.json({ mensaje: 'Cliente actualizado', resultado });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};