const { body, validationResult } = require('express-validator');

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Error de validación',
      details: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

// Validadores reutilizables para clientes
const validateClient = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ min: 3, max: 100 })
    .withMessage('El nombre debe tener entre 3 y 100 caracteres'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('El teléfono es obligatorio')
    .matches(/^\d+$/)
    .withMessage('El teléfono debe contener solo números'),
  body('email')
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage('Email debe ser válido'),
];

// Validadores para motos
const validateBike = [
  body('plate')
    .trim()
    .notEmpty()
    .withMessage('La placa es obligatoria')
    .toUpperCase(),
  body('brand')
    .trim()
    .notEmpty()
    .withMessage('La marca es obligatoria'),
  body('model')
    .trim()
    .notEmpty()
    .withMessage('El modelo es obligatorio'),
  body('cylinder')
    .optional({ checkFalsy: true })
    .trim(),
  body('clientId')
    .isInt()
    .withMessage('ClientId debe ser un número entero'),
];

// Validadores para órdenes de trabajo
const validateWorkOrder = [
  body('motoId')
    .isInt()
    .withMessage('MotoId debe ser un número entero'),
  body('faultDescription')
    .trim()
    .notEmpty()
    .withMessage('La descripción de la falla es obligatoria'),
  body('status')
    .optional({ checkFalsy: true })
    .isIn(['RECIBIDA', 'DIAGNOSTICO', 'EN_PROCESO', 'LISTA', 'ENTREGADA', 'CANCELADA'])
    .withMessage('Estado no válido'),
];

// Validadores para items de orden
const validateWorkOrderItem = [
  body('type')
    .isIn(['MANO_OBRA', 'REPUESTO'])
    .withMessage('Tipo debe ser MANO_OBRA o REPUESTO'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('La descripción es obligatoria'),
  body('count')
    .isInt({ min: 1 })
    .withMessage('La cantidad debe ser mayor a 0'),
  body('unitValue')
    .isFloat({ min: 0 })
    .withMessage('El valor unitario debe ser >= 0'),
];

const validateRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ min: 3, max: 100 })
    .withMessage('El nombre debe tener entre 3 y 100 caracteres'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El email es obligatorio')
    .isEmail()
    .withMessage('Email debe ser valido'),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es obligatoria')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('role')
    .optional({ checkFalsy: true })
    .isIn(['ADMIN', 'MECANICO'])
    .withMessage('Rol no valido'),
];

const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El email es obligatorio')
    .isEmail()
    .withMessage('Email debe ser valido'),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es obligatoria'),
];

const validateAdminUserUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('El nombre debe tener entre 3 y 100 caracteres'),
  body('role')
    .optional()
    .isIn(['ADMIN', 'MECANICO'])
    .withMessage('Rol no valido'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive debe ser booleano'),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
];

module.exports = {
  handleValidationErrors,
  validateClient,
  validateBike,
  validateWorkOrder,
  validateWorkOrderItem,
  validateRegister,
  validateLogin,
  validateAdminUserUpdate,
};
