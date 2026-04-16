const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({
        success: false,
        error: 'No autenticado',
        message: 'Debes enviar un token Bearer valido',
      });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Token invalido o expirado',
    });
  }
};

const optionalAuthenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const [scheme, token] = authHeader.split(' ');

    if (scheme === 'Bearer' && token) {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = payload;
    }

    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Token invalido o expirado',
    });
  }
};

const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      error: 'No autorizado',
      message: `Acceso permitido solo para roles: ${roles.join(', ')}`,
    });
  }
  return next();
};

module.exports = {
  authenticate,
  optionalAuthenticate,
  authorizeRoles,
};
