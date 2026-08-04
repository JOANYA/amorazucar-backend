class Usuario {
  #id_usuario;
  #dni;
  #nombre;
  #apellido;
  #password_hash;
  #rol;
  #telefono;
  #correo;
  #estado;
  #created_at;
  #updated_at;

  constructor({
    id_usuario = null,
    dni,
    nombre,
    apellido,
    password_hash,
    rol,
    telefono = null,
    correo = null,
    estado = 'Activo',
    created_at = null,
    updated_at = null
  }) {
    this.#id_usuario = id_usuario;
    this.#dni = dni;
    this.#nombre = nombre;
    this.#apellido = apellido;
    this.#password_hash = password_hash;
    this.#rol = rol;
    this.#telefono = telefono;
    this.#correo = correo;
    this.#estado = estado;
    this.#created_at = created_at;
    this.#updated_at = updated_at;
  }

  // Getters
  get id_usuario() { return this.#id_usuario; }
  get dni() { return this.#dni; }
  get nombre() { return this.#nombre; }
  get apellido() { return this.#apellido; }
  get password_hash() { return this.#password_hash; }
  get rol() { return this.#rol; }
  get telefono() { return this.#telefono; }
  get correo() { return this.#correo; }
  get estado() { return this.#estado; }
  get created_at() { return this.#created_at; }
  get updated_at() { return this.#updated_at; }

  // Setters
  set id_usuario(id) { this.#id_usuario = id; }
  set dni(val) { this.#dni = val; }
  set nombre(val) { this.#nombre = val; }
  set apellido(val) { this.#apellido = val; }
  set password_hash(val) { this.#password_hash = val; }
  set rol(val) { this.#rol = val; }
  set telefono(val) { this.#telefono = val; }
  set correo(val) { this.#correo = val; }
  set estado(val) { this.#estado = val; }

  toJSON() {
    return {
      id_usuario: this.#id_usuario,
      dni: this.#dni,
      nombre: this.#nombre,
      apellido: this.#apellido,
      rol: this.#rol,
      telefono: this.#telefono,
      correo: this.#correo,
      estado: this.#estado,
      created_at: this.#created_at,
      updated_at: this.#updated_at
    };
  }
}

module.exports = Usuario;