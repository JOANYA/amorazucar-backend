class Categoria {
  #id_categoria;
  #nombre;
  #descripcion;
  #estado;

  constructor({
    id_categoria = null,
    nombre,
    descripcion = null,
    estado = 'Activo'
  }) {
    this.#id_categoria = id_categoria;
    this.#nombre = nombre;
    this.#descripcion = descripcion;
    this.#estado = estado;
  }

  // Getters
  get id_categoria() { return this.#id_categoria; }
  get nombre() { return this.#nombre; }
  get descripcion() { return this.#descripcion; }
  get estado() { return this.#estado; }

  // Setters
  set id_categoria(val) { this.#id_categoria = val; }
  set nombre(val) { this.#nombre = val; }
  set descripcion(val) { this.#descripcion = val; }
  set estado(val) { this.#estado = val; }

  toJSON() {
    return {
      id_categoria: this.#id_categoria,
      nombre: this.#nombre,
      descripcion: this.#descripcion,
      estado: this.#estado
    };
  }
}

module.exports = Categoria;