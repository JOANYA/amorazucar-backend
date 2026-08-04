class Cliente {
  #id_cliente;
  #num_documento;
  #nombre_razon_social;
  #telefono;
  #correo;
  #direccion;
  #fecha_registro;

  constructor({
    id_cliente = null,
    num_documento = null,
    nombre_razon_social,
    telefono = null,
    correo = null,
    direccion = null,
    fecha_registro = null
  }) {
    this.#id_cliente = id_cliente;
    this.#num_documento = num_documento;
    this.#nombre_razon_social = nombre_razon_social;
    this.#telefono = telefono;
    this.#correo = correo;
    this.#direccion = direccion;
    this.#fecha_registro = fecha_registro;
  }

  // Getters
  get id_cliente() { return this.#id_cliente; }
  get num_documento() { return this.#num_documento; }
  get nombre_razon_social() { return this.#nombre_razon_social; }
  get telefono() { return this.#telefono; }
  get correo() { return this.#correo; }
  get direccion() { return this.#direccion; }
  get fecha_registro() { return this.#fecha_registro; }

  // Setters
  set id_cliente(val) { this.#id_cliente = val; }
  set num_documento(val) { this.#num_documento = val; }
  set nombre_razon_social(val) { this.#nombre_razon_social = val; }
  set telefono(val) { this.#telefono = val; }
  set correo(val) { this.#correo = val; }
  set direccion(val) { this.#direccion = val; }

  toJSON() {
    return {
      id_cliente: this.#id_cliente,
      num_documento: this.#num_documento,
      nombre_razon_social: this.#nombre_razon_social,
      telefono: this.#telefono,
      correo: this.#correo,
      direccion: this.#direccion,
      fecha_registro: this.#fecha_registro
    };
  }
}

module.exports = Cliente;