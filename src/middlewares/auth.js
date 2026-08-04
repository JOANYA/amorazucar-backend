const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_dulce_amor';

// 1. Generar Token JWT con datos del modelo Usuario
const generarToken = (usuario) => {
  return jwt.sign(
    {
      id_usuario: usuario.id_usuario,
      rol: usuario.rol,
      correo: usuario.correo,
      dni: usuario.dni
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// 2. Middleware para verificar Token JWT en peticiones HTTP
const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato: Bearer <token>

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado: Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded; // Inyecta el usuario decodificado en la request
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
};

// 3. Middlewares de autorización por Roles

// Permiso exclusivo para Administrador
const soloAdmin = (req, res, next) => {
  if (req.usuario?.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado: Se requieren permisos de Administrador' });
  }
  next();
};

// Permiso para registrar/gestionar pedidos: el cliente que compra, o el admin.
// Ya no existe el rol 'vendedor': el cliente arma su propio pedido (self-service)
// y el admin es quien confirma pagos y gestiona todo.
const soloVentas = (req, res, next) => {
  if (!['admin', 'cliente'].includes(req.usuario?.rol)) {
    return res.status(403).json({ error: 'Acceso denegado: Solo clientes o administración' });
  }
  next();
};

// Permiso para Cocina/Pastelería y Admin
const soloPastelero = (req, res, next) => {
  if (!['admin', 'pastelero'].includes(req.usuario?.rol)) {
    return res.status(403).json({ error: 'Acceso denegado: Solo personal de cocina o administración' });
  }
  next();
};

// Exportación centralizada de todos los elementos
module.exports = {
  generarToken,
  verificarToken,
  soloAdmin,
  soloVentas,
  soloPastelero
};