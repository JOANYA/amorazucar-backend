class MenuDia {
  #id_menu;
  #id_postre;
  #dia_semana;
  #stock_programado;
  #estado;

  constructor({
    id_menu = null,
    id_postre,
    dia_semana,
    stock_programado,
    estado = 'Activo'
  }) {
    this.#id_menu = id_menu;
    this.#id_postre = id_postre;
    this.#dia_semana = dia_semana;
    this.#stock_programado = stock_programado;
    this.#estado = estado;
  }

  // Getters
  get id_menu() { return this.#id_menu; }
  get id_postre() { return this.#id_postre; }
  get dia_semana() { return this.#dia_semana; }
  get stock_programado() { return this.#stock_programado; }
  get estado() { return this.#estado; }

  // Setters
  set id_menu(val) { this.#id_menu = val; }
  set id_postre(val) { this.#id_postre = val; }
  set dia_semana(val) { this.#dia_semana = val; }
  set stock_programado(val) { this.#stock_programado = val; }
  set estado(val) { this.#estado = val; }

  toJSON() {
    return {
      id_menu: this.#id_menu,
      id_postre: this.#id_postre,
      dia_semana: this.#dia_semana,
      stock_programado: this.#stock_programado,
      estado: this.#estado
    };
  }
}

module.exports = MenuDia;