const rateLimit = require('express-rate-limit');

/**
 * Rate limiter para login - 5 intentos cada 15 minutos por IP
 * Protege contra ataques de fuerza bruta
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Máximo 5 intentos
  message: {
    success: false,
    error: 'Demasiados intentos de login. Intenta de nuevo en 15 minutos.',
  },
  standardHeaders: true, // Retorna info del rate-limit en headers `RateLimit-*`
  legacyHeaders: false, // Deshabilita headers `X-RateLimit-*`
  skip: (req, res) => {
    // No aplica rate-limit a requests que no sean POST login
    return req.method !== 'POST';
  },
});

module.exports = { loginLimiter };
