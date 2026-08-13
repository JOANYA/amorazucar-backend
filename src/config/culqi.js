const Culqi = require('culqi-node');

// Igual que en config/db.js: solo carga dotenv si estamos en local.
if (!process.env.CULQI_SECRET_KEY) {
  require('dotenv').config();
}

// La llave SECRETA (sk_test_... / sk_live_...) SOLO vive aquí, en el
// backend. Nunca se manda al frontend. La llave PÚBLICA (pk_test_...) sí
// es segura de exponer y va en el frontend (environment.ts), porque el
// widget de Culqi Checkout la necesita para tokenizar la tarjeta ahí mismo,
// en el navegador del cliente — el número de tarjeta nunca pasa por
// nuestro servidor, solo el token ya generado.
const culqi = new Culqi({
  privateKey: process.env.CULQI_SECRET_KEY,
});

module.exports = culqi;
