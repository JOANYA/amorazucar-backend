const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Carpeta donde se guardan las fotos de comprobantes (Yape/Plin).
// Se sirve como estática porque app.js ya tiene:
//   app.use(express.static(path.join(__dirname, 'public')));
// Entonces un archivo guardado aquí queda accesible en:
//   http://localhost:3000/images/comprobantes/<archivo>
const CARPETA_COMPROBANTES = path.join(__dirname, '..', '..', 'public', 'images', 'comprobantes');

if (!fs.existsSync(CARPETA_COMPROBANTES)) {
  fs.mkdirSync(CARPETA_COMPROBANTES, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, CARPETA_COMPROBANTES),
  filename: (req, file, cb) => {
    const idVenta = req.params.id || 'sinid';
    const extension = path.extname(file.originalname) || '.jpg';
    const nombreUnico = `venta-${idVenta}-${Date.now()}${extension}`;
    cb(null, nombreUnico);
  }
});

const filtroImagen = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('El comprobante debe ser una imagen (foto o captura de pantalla).'));
  }
};

const uploadComprobante = multer({
  storage,
  fileFilter: filtroImagen,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
});

// --- Fotos de producto (postres), mostradas en Tienda y Home ---
const CARPETA_POSTRES = path.join(__dirname, '..', '..', 'public', 'images', 'postres');

if (!fs.existsSync(CARPETA_POSTRES)) {
  fs.mkdirSync(CARPETA_POSTRES, { recursive: true });
}

const storagePostre = multer.diskStorage({
  destination: (req, file, cb) => cb(null, CARPETA_POSTRES),
  filename: (req, file, cb) => {
    const idPostre = req.params.id || 'sinid';
    const extension = path.extname(file.originalname) || '.jpg';
    const nombreUnico = `postre-${idPostre}-${Date.now()}${extension}`;
    cb(null, nombreUnico);
  }
});

const uploadImagenPostre = multer({
  storage: storagePostre,
  fileFilter: filtroImagen,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
});

module.exports = { uploadComprobante, uploadImagenPostre };
