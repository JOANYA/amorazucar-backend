const UsuarioService = require('../services/UsuarioService');
const Usuario = require('../models/Usuario');
const { generarToken } = require('../middlewares/auth');

exports.login = async (req, res) => {
  try {
    const { dni, password_hash } = req.body;
    // Ejecuta el Stored Procedure sp_LoginUsuario
    const usuario = await UsuarioService.login(dni, password_hash);

    // Antes esto nunca se generaba: sin token, todas las rutas protegidas
    // (crear postre, registrar venta, etc.) devolvían 401 sin importar el login.
    const token = generarToken(usuario);

    res.json({ mensaje: 'Login exitoso', usuario, token });
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
};

exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await UsuarioService.listar();
    res.json(usuarios);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.crearUsuario = async (req, res) => {
  try {
    const nuevoUsuario = new Usuario(req.body);
    const resultado = await UsuarioService.crear(nuevoUsuario);
    res.status(201).json({ mensaje: 'Usuario creado exitosamente', resultado });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.obtenerPorId = async (req, res) => {
  try {
    const usuario = await UsuarioService.obtenerPorId(req.params.id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.actualizarEstado = async (req, res) => {
  try {
    const { estado } = req.body;
    const resultado = await UsuarioService.cambiarEstado(req.params.id, estado);
    res.json({ mensaje: 'Estado de usuario actualizado', resultado });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};