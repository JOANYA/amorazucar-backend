class DetalleVenta {
  #id_detalle;
  #id_venta;
  #id_postre;
  #cantidad;
  #precio_unitario;
  #subtotal;

  constructor({
    id_detalle = null,
    id_venta,
    id_postre,
    cantidad,
    precio_unitario,
    subtotal = null
  }) {
    this.#id_detalle = id_detalle;
    this.#id_venta = id_venta;
    this.#id_postre = id_postre;
    this.#cantidad = cantidad;
    this.#precio_unitario = precio_unitario;
    this.#subtotal = subtotal;
  }

  // Getters
  get id_detalle() { return this.#id_detalle; }
  get id_venta() { return this.#id_venta; }
  get id_postre() { return this.#id_postre; }
  get cantidad() { return this.#cantidad; }
  get precio_unitario() { return this.#precio_unitario; }
  get subtotal() { return this.#subtotal; }

  // Setters
  set id_detalle(val) { this.#id_detalle = val; }
  set id_venta(val) { this.#id_venta = val; }
  set id_postre(val) { this.#id_postre = val; }
  set cantidad(val) { this.#cantidad = val; }
  set precio_unitario(val) { this.#precio_unitario = val; }

  toJSON() {
    return {
      id_detalle: this.#id_detalle,
      id_venta: this.#id_venta,
      id_postre: this.#id_postre,
      cantidad: this.#cantidad,
      precio_unitario: this.#precio_unitario,
      subtotal: this.#subtotal
    };
  }
}

module.exports = DetalleVenta;