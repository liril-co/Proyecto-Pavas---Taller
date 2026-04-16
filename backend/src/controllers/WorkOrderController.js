const WorkOrderService = require('../services/WorkOrderService');

class WorkOrderController {
  async createWorkOrder(req, res, next) {
    try {
      const order = await WorkOrderService.createWorkOrder(req.body);
      res.status(201).json({
        success: true,
        message: 'Orden de trabajo creada correctamente',
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllWorkOrders(req, res, next) {
    try {
      const { status = '', plate = '', page = 1, pageSize = 10 } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(pageSize);
      const limit = parseInt(pageSize);

      const filters = {};
      if (status) filters.status = status;
      if (plate) filters.plate = plate;

      const { data, total } = await WorkOrderService.getAllWorkOrders(
        filters,
        offset,
        limit
      );

      res.status(200).json({
        success: true,
        data,
        pagination: {
          page: parseInt(page),
          pageSize: parseInt(pageSize),
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getWorkOrderById(req, res, next) {
    try {
      const order = await WorkOrderService.getWorkOrderById(req.params.id);
      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateWorkOrderStatus(req, res, next) {
    try {
      const { status, note } = req.body;

      if (!['RECIBIDA', 'DIAGNOSTICO', 'EN_PROCESO', 'LISTA', 'ENTREGADA', 'CANCELADA'].includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Estado no válido',
        });
      }

      const order = await WorkOrderService.updateWorkOrderStatus(
        req.params.id,
        status,
        note,
        req.user.id,
        req.user.role
      );

      res.status(200).json({
        success: true,
        message: 'Estado actualizado correctamente',
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  async addItemToWorkOrder(req, res, next) {
    try {
      const item = await WorkOrderService.addItemToWorkOrder(req.params.id, req.body);

      res.status(201).json({
        success: true,
        message: 'Ítem agregado correctamente',
        data: item,
      });
    } catch (error) {
      next(error);
    }
  }

  async removeItemFromWorkOrder(req, res, next) {
    try {
      await WorkOrderService.removeItemFromWorkOrder(req.params.itemId);

      res.status(200).json({
        success: true,
        message: 'Ítem eliminado correctamente',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new WorkOrderController();
