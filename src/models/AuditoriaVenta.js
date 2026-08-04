class AuditoriaVentas {
  #id_auditoria;
  #id_venta;
  #estado_anterior;
  #estado_nuevo;
  #fecha_cambio;
  #id_usuario_cambio;

  constructor({
    id_auditoria = null,
    id_venta,
    estado_anterior,
    estado_nuevo,
    fecha_cambio = null,
    id_usuario_cambio
  }) {
    this.#id_auditoria = id_auditoria;
    this.#id_venta = id_venta;
    this.#estado_anterior = estado_anterior;
    this.#estado_nuevo = estado_nuevo;
    this.#fecha_cambio = fecha_cambio;
    this.#id_usuario_cambio = id_usuario_cambio;
  }

  // Getters
  get id_auditoria() { return this.#id_auditoria; }
  get id_venta() { return this.#id_venta; }
  get estado_anterior() { return this.#estado_anterior; }
  get estado_nuevo() { return this.#estado_nuevo; }
  get fecha_cambio() { return this.#fecha_cambio; }
  get id_usuario_cambio() { return this.#id_usuario_cambio; }

  // Setters
  set id_auditoria(val) { this.#id_auditoria = val; }
  set id_venta(val) { this.#id_venta = val; }
  set estado_anterior(val) { this.#estado_anterior = val; }
  set estado_nuevo(val) { this.#estado_nuevo = val; }
  set id_usuario_cambio(val) { this.#id_usuario_cambio = val; }

  toJSON() {
    return {
      id_auditoria: this.#id_auditoria,
      id_venta: this.#id_venta,
      estado_anterior: this.#estado_anterior,
      estado_nuevo: this.#estado_nuevo,
      fecha_cambio: this.#fecha_cambio,
      id_usuario_cambio: this.#id_usuario_cambio
    };
  }
}

module.exports = AuditoriaVentas;