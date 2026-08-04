const MenuDiaRepository = require('../repositories/MenuDiaRepository');
const PostreRepository = require('../repositories/PostreRepository');

class MenuDiaService {
  async obtenerMenuHoy() {
    return MenuDiaRepository.obtenerMenuHoy();
  }

  async listarPorDia(diaSemana) {
    const diasValidos = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
    if (!diasValidos.includes(diaSemana)) {
      throw new Error('Día de la semana no válido');
    }
    return MenuDiaRepository.listarPorDia(diaSemana);
  }

  async programar(menuData) {
    const postre = await PostreRepository.obtenerPorId(menuData.id_postre);
    if (!postre) {
      throw new Error('El postre a programar no existe');
    }

    if (!menuData.stock_programado || menuData.stock_programado <= 0) {
      throw new Error('Debe definir un stock programado válido para el día');
    }

    return MenuDiaRepository.programar(menuData);
  }
}

module.exports = new MenuDiaService();