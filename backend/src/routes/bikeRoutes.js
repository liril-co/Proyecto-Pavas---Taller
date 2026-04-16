const express = require('express');
const BikeController = require('../controllers/BikeController');
const {
  handleValidationErrors,
  validateBike,
} = require('../middlewares/validators');
const { authenticate, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();

router.use(authenticate);

// POST /api/bikes - Crear moto
router.post('/', authorizeRoles('ADMIN', 'MECANICO'), validateBike, handleValidationErrors, (req, res, next) => {
  BikeController.createBike(req, res, next);
});

// GET /api/bikes?plate= - Obtener motos con búsqueda por placa
router.get('/', (req, res, next) => {
  BikeController.getAllBikes(req, res, next);
});

// GET /api/bikes/:id - Obtener moto por ID
router.get('/:id', (req, res, next) => {
  BikeController.getBikeById(req, res, next);
});

// PUT /api/bikes/:id - Actualizar moto
router.put('/:id', authorizeRoles('ADMIN', 'MECANICO'), validateBike, handleValidationErrors, (req, res, next) => {
  BikeController.updateBike(req, res, next);
});

// DELETE /api/bikes/:id - Eliminar moto
router.delete('/:id', authorizeRoles('ADMIN'), (req, res, next) => {
  BikeController.deleteBike(req, res, next);
});

module.exports = router;
