class Venta {
  #id_venta;
  #id_cliente;
  #id_usuario;
  #fecha_hora;
  #monto_total;
  #metodo_pago;
  #tipo_comprobante;
  #estado_venta;
  #observaciones;

  constructor({
    id_venta = null,
    id_cliente = null,
    id_usuario,
    fecha_hora = null,
    monto_total = 0.00,
    metodo_pago,
    tipo_comprobante = 'Boleta',
    estado_venta = 'Completada',
    observaciones = null
  }) {
    this.#id_venta = id_venta;
    this.#id_cliente = id_cliente;
    this.#id_usuario = id_usuario;
    this.#fecha_hora = fecha_hora;
    this.#monto_total = monto_total;
    this.#metodo_pago = metodo_pago;
    this.#tipo_comprobante = tipo_comprobante;
    this.#estado_venta = estado_venta;
    this.#observaciones = observaciones;
  }

  // Getters
  get id_venta() { return this.#id_venta; }
  get id_cliente() { return this.#id_cliente; }
  get id_usuario() { return this.#id_usuario; }
  get fecha_hora() { return this.#fecha_hora; }
  get monto_total() { return this.#monto_total; }
  get metodo_pago() { return this.#metodo_pago; }
  get tipo_comprobante() { return this.#tipo_comprobante; }
  get estado_venta() { return this.#estado_venta; }
  get observaciones() { return this.#observaciones; }

  // Setters
  set id_venta(val) { this.#id_venta = val; }
  set id_cliente(val) { this.#id_cliente = val; }
  set id_usuario(val) { this.#id_usuario = val; }
  set monto_total(val) { this.#monto_total = val; }
  set metodo_pago(val) { this.#metodo_pago = val; }
  set tipo_comprobante(val) { this.#tipo_comprobante = val; }
  set estado_venta(val) { this.#estado_venta = val; }
  set observaciones(val) { this.#observaciones = val; }

  toJSON() {
    return {
      id_venta: this.#id_venta,
      id_cliente: this.#id_cliente,
      id_usuario: this.#id_usuario,
      fecha_hora: this.#fecha_hora,
      monto_total: this.#monto_total,
      metodo_pago: this.#metodo_pago,
      tipo_comprobante: this.#tipo_comprobante,
      estado_venta: this.#estado_venta,
      observaciones: this.#observaciones
    };
  }
}

module.exports = Venta;