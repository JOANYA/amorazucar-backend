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

module.exports = cloudinary;