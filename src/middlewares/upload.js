const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// ⚠️ Ya NO se guarda nada en disco local (public/images/...). Render usa
// disco efímero: cada vez que el servicio se reinicia o se redeploya, todo
// lo que se guardó en el filesystem se pierde. Por eso las fotos de
// comprobantes y de postres se suben directo a Cloudinary, que es
// almacenamiento externo y persistente. `req.file.path` (que llena
// multer-storage-cloudinary) ya es la URL pública y definitiva de la
// imagen — eso es justo lo que se guarda en `comprobante_pago` / `imagen`.

const filtroImagen = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('El archivo debe ser una imagen (foto o captura de pantalla).'));
  }
};

// --- Comprobantes de pago (Yape/Plin) ---
const storageComprobantes = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'azucar-amor/comprobantes',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    // ids únicos y buscables: venta-<id>-<timestamp>
    public_id: (req, file) => `venta-${req.params.id || 'sinid'}-${Date.now()}`,
  },
});

const uploadComprobante = multer({
  storage: storageComprobantes,
  fileFilter: filtroImagen,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// --- Fotos de producto (postres) ---
const storagePostres = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'azucar-amor/postres',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    public_id: (req, file) => `postre-${req.params.id || 'sinid'}-${Date.now()}`,
  },
});

const uploadImagenPostre = multer({
  storage: storagePostres,
  fileFilter: filtroImagen,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

module.exports = { uploadComprobante, uploadImagenPostre };