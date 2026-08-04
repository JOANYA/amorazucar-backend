class Notificacion {
  #id_notificacion;
  #id_usuario;
  #id_venta;
  #mensaje;
  #fecha_envio;
  #leido;

  constructor({
    id_notificacion = null,
    id_usuario,
    id_venta = null,
    mensaje,
    fecha_envio = null,
    leido = false
  }) {
    this.#id_notificacion = id_notificacion;
    this.#id_usuario = id_usuario;
    this.#id_venta = id_venta;
    this.#mensaje = mensaje;
    this.#fecha_envio = fecha_envio;
    this.#leido = leido;
  }

  // Getters
  get id_notificacion() { return this.#id_notificacion; }
  get id_usuario() { return this.#id_usuario; }
  get id_venta() { return this.#id_venta; }
  get mensaje() { return this.#mensaje; }
  get fecha_envio() { return this.#fecha_envio; }
  get leido() { return this.#leido; }

  // Setters
  set id_notificacion(val) { this.#id_notificacion = val; }
  set id_usuario(val) { this.#id_usuario = val; }
  set id_venta(val) { this.#id_venta = val; }
  set mensaje(val) { this.#mensaje = val; }
  set leido(val) { this.#leido = val; }

  toJSON() {
    return {
      id_notificacion: this.#id_notificacion,
      id_usuario: this.#id_usuario,
      id_venta: this.#id_venta,
      mensaje: this.#mensaje,
      fecha_envio: this.#fecha_envio,
      leido: this.#leido
    };
  }
}

module.exports = Notificacion;