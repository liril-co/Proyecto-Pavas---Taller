// Middleware de manejo global de errores
const errorHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;

  // Validaciones de Sequelize
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Error de validación',
      details: err.errors.map((e) => ({
        field: e.path,
        message: e.message,
      })),
    });
  }

  // Errores de BD únicas
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      success: false,
      error: 'Conflicto: El registro ya existe',
      details: err.errors.map((e) => ({
        field: e.path,
        message: `${e.path} ya existe en el sistema`,
      })),
    });
  }

  // Errores de FK
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      success: false,
      error: 'Referencia inválida',
      message: 'El registro referenciado no existe',
    });
  }

  // Reglas de negocio
  if (err.name === 'InvalidTransitionError') {
    return res.status(400).json({
      success: false,
      error: 'Transición de estado inválida',
      message,
    });
  }

  res.status(statusCode).json({
    success: false,
    error: message || 'Error interno del servidor',
  });
};

module.exports = errorHandler;
