const ClienteRepository = require('../repositories/ClienteRepository');
const Cliente = require('../models/Cliente');

class ClienteService {
  async listar() {
    return ClienteRepository.listar();
  }

  async buscarPorDocumento(numDocumento) {
    const cliente = await ClienteRepository.buscarPorDocumento(numDocumento);
    if (!cliente) {
      throw new Error('Cliente no registrado');
    }
    return cliente;
  }

  async crear(data) {
    if (!data.nombre_razon_social) {
      throw new Error('El nombre o razón social es obligatorio');
    }

    if (data.num_documento) {
      const existe = await ClienteRepository.buscarPorDocumento(data.num_documento);
      if (existe) {
        throw new Error('El número de documento ya está registrado');
      }
    }

    const cliente = new Cliente(data);
    return ClienteRepository.crear(cliente);
  }

  async actualizar(clienteData) {
    const cliente = await ClienteRepository.obtenerPorId(clienteData.id_cliente);
    if (!cliente) {
      throw new Error('Cliente a actualizar no existe');
    }
    return ClienteRepository.actualizar(clienteData);
  }
}

module.exports = new ClienteService();