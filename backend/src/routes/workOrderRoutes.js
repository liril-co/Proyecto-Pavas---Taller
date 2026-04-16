const express = require('express');
const WorkOrderController = require('../controllers/WorkOrderController');
const WorkOrderStatusHistoryController = require('../controllers/WorkOrderStatusHistoryController');
const {
  handleValidationErrors,
  validateWorkOrder,
  validateWorkOrderItem,
} = require('../middlewares/validators');
const { authenticate, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();

router.use(authenticate);

// POST /api/work-orders - Crear orden de trabajo
router.post(
  '/',
  authorizeRoles('ADMIN', 'MECANICO'),
  validateWorkOrder,
  handleValidationErrors,
  (req, res, next) => {
    WorkOrderController.createWorkOrder(req, res, next);
  }
);

// GET /api/work-orders?status=&plate=&page=&pageSize= - Obtener órdenes
router.get('/', (req, res, next) => {
  WorkOrderController.getAllWorkOrders(req, res, next);
});

// GET /api/work-orders/:id/history - Obtener historial de cambios de estado
router.get('/:id/history', (req, res, next) => {
  WorkOrderStatusHistoryController.getWorkOrderHistory(req, res, next);
});

// GET /api/work-orders/:id - Obtener orden por ID
router.get('/:id', (req, res, next) => {
  WorkOrderController.getWorkOrderById(req, res, next);
});

// PATCH /api/work-orders/:id/status - Actualizar estado
router.patch('/:id/status', authorizeRoles('ADMIN', 'MECANICO'), (req, res, next) => {
  WorkOrderController.updateWorkOrderStatus(req, res, next);
});

// POST /api/work-orders/:id/items - Agregar item a orden
router.post(
  '/:id/items',
  authorizeRoles('ADMIN', 'MECANICO'),
  validateWorkOrderItem,
  handleValidationErrors,
  (req, res, next) => {
    WorkOrderController.addItemToWorkOrder(req, res, next);
  }
);

// DELETE /api/work-orders/items/:itemId - Eliminar item
router.delete('/items/:itemId', authorizeRoles('ADMIN', 'MECANICO'), (req, res, next) => {
  WorkOrderController.removeItemFromWorkOrder(req, res, next);
});

module.exports = router;
