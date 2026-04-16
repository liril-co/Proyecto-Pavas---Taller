const express = require('express');
const ClientController = require('../controllers/ClientController');
const {
  handleValidationErrors,
  validateClient,
} = require('../middlewares/validators');
const { authenticate, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();

router.use(authenticate);

// POST /api/clients - Crear cliente
router.post('/', authorizeRoles('ADMIN', 'MECANICO'), validateClient, handleValidationErrors, (req, res, next) => {
  ClientController.createClient(req, res, next);
});

// GET /api/clients?search= - Obtener clientes con búsqueda
router.get('/', (req, res, next) => {
  ClientController.getAllClients(req, res, next);
});

// GET /api/clients/:id - Obtener cliente por ID
router.get('/:id', (req, res, next) => {
  ClientController.getClientById(req, res, next);
});

// PUT /api/clients/:id - Actualizar cliente
router.put('/:id', authorizeRoles('ADMIN', 'MECANICO'), validateClient, handleValidationErrors, (req, res, next) => {
  ClientController.updateClient(req, res, next);
});

// DELETE /api/clients/:id - Eliminar cliente
router.delete('/:id', authorizeRoles('ADMIN'), (req, res, next) => {
  ClientController.deleteClient(req, res, next);
});

module.exports = router;
