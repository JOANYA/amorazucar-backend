const UsuarioRepository = require('../repositories/UsuarioRepository');
const Usuario = require('../models/Usuario');

class UsuarioService {
  async login(dni, password_hash) {
    if (!dni || !password_hash) {
      throw new Error('DNI y contraseña son requeridos');
    }
    const usuario = await UsuarioRepository.login(dni, password_hash);
    if (!usuario) {
      throw new Error('Credenciales inválidas o usuario inactivo');
    }
    return usuario;
  }

  async listar() {
    return UsuarioRepository.listar();
  }

  async obtenerPorId(id) {
    const usuario = await UsuarioRepository.obtenerPorId(id);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }
    return usuario;
  }

  async crear(data) {
    const existeDni = await UsuarioRepository.obtenerPorDni(data.dni);
    if (existeDni) {
      throw new Error('El DNI ya se encuentra registrado');
    }

    // Si no mandan rol o viene vacío, por defecto es cliente
    if (!data.rol) {
      data.rol = 'cliente';
    }

    // Actualizamos la lista de roles permitidos acorde a tu base de datos
    const rolesValidos = ['admin', 'pastelero', 'cliente'];
    if (!rolesValidos.includes(data.rol)) {
      throw new Error('Rol no válido para el sistema de pastelería');
    }

    const nuevoUsuario = new Usuario(data);
    return UsuarioRepository.crear(nuevoUsuario);
  }

  async cambiarEstado(id, estado) {
    const usuario = await UsuarioRepository.obtenerPorId(id);
    if (!usuario) {
      throw new Error('Usuario no existe');
    }
    return UsuarioRepository.cambiarEstado(id, estado);
  }
}

module.exports = new UsuarioService();