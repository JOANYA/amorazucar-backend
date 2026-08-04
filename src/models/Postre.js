class Postre {
  #id_postre;
  #id_categoria;
  #nombre;
  #descripcion;
  #precio_actual;
  #stock_total;
  #estado;
  #imagen;

  constructor({
    id_postre = null,
    id_categoria,
    nombre,
    descripcion = null,
    precio_actual,
    stock_total = 0,
    estado = 'Disponible',
    imagen = null
  }) {
    this.#id_postre = id_postre;
    this.#id_categoria = id_categoria;
    this.#nombre = nombre;
    this.#descripcion = descripcion;
    this.#precio_actual = precio_actual;
    this.#stock_total = stock_total;
    this.#estado = estado;
    this.#imagen = imagen;
  }

  // Getters
  get id_postre() { return this.#id_postre; }
  get id_categoria() { return this.#id_categoria; }
  get nombre() { return this.#nombre; }
  get descripcion() { return this.#descripcion; }
  get precio_actual() { return this.#precio_actual; }
  get stock_total() { return this.#stock_total; }
  get estado() { return this.#estado; }
  get imagen() { return this.#imagen; }

  // Setters
  set id_postre(val) { this.#id_postre = val; }
  set id_categoria(val) { this.#id_categoria = val; }
  set nombre(val) { this.#nombre = val; }
  set descripcion(val) { this.#descripcion = val; }
  set precio_actual(val) { this.#precio_actual = val; }
  set stock_total(val) { this.#stock_total = val; }
  set estado(val) { this.#estado = val; }
  set imagen(val) { this.#imagen = val; }

  toJSON() {
    return {
      id_postre: this.#id_postre,
      id_categoria: this.#id_categoria,
      nombre: this.#nombre,
      descripcion: this.#descripcion,
      precio_actual: this.#precio_actual,
      stock_total: this.#stock_total,
      estado: this.#estado,
      imagen: this.#imagen
    };
  }
}

module.exports = Postre;