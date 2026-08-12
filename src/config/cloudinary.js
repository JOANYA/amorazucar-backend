const cloudinary = require('cloudinary').v2;

// Igual que en config/db.js: solo carga dotenv si estamos en local.
if (!process.env.CLOUDINARY_CLOUD_NAME) {
  require('dotenv').config();
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔎 Diagnóstico temporal — NO expone el secreto completo, solo su
// longitud y los primeros/últimos 2 caracteres, para poder comparar contra
// el Dashboard de Cloudinary sin arriesgar la credencial. Bórralo una vez
// que confirmes que las credenciales cargan bien.
function enmascarar(valor) {
  if (!valor) return '(vacío o undefined)';
  if (valor.length <= 4) return `"${valor}" (longitud: ${valor.length})`;
  return `"${valor.slice(0, 2)}...${valor.slice(-2)}" (longitud: ${valor.length})`;
}

console.log('🔎 Cloudinary config cargada:');
console.log('   cloud_name:', process.env.CLOUDINARY_CLOUD_NAME || '(vacío o undefined)');
console.log('   api_key:', enmascarar(process.env.CLOUDINARY_API_KEY));
console.log('   api_secret:', enmascarar(process.env.CLOUDINARY_API_SECRET));

module.exports = cloudinary;