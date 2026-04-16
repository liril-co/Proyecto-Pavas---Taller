const db = require('../models');
const { Op } = require('sequelize');
const WorkOrderStatusHistoryService = require('./WorkOrderStatusHistoryService');

const STATUS_FLOW = {
  RECIBIDA: ['DIAGNOSTICO', 'CANCELADA'],
  DIAGNOSTICO: ['EN_PROCESO', 'CANCELADA'],
  EN_PROCESO: ['LISTA', 'CANCELADA'],
  LISTA: ['ENTREGADA', 'CANCELADA'],
  ENTREGADA: [],
  CANCELADA: [],
};

class WorkOrderService {
  // Crear orden de trabajo
  async createWorkOrder(orderData) {
    const transaction = await db.sequelize.transaction();

    try {
      // Verificar que la moto existe
      const bike = await db.Bike.findByPk(orderData.motoId);
      if (!bike) {
        await transaction.rollback();
        const error = new Error('Moto no encontrada');
        error.name = 'SequelizeForeignKeyConstraintError';
        throw error;
      }

      const order = await db.WorkOrder.create(
        { ...orderData, status: 'RECIBIDA' },
        { transaction }
      );
      await transaction.commit();

      return order;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Obtener órdenes con filtros
  async getAllWorkOrders(filters = {}, offset = 0, limit = 10) {
    try {
      const where = {};

      if (filters.status) {
        where.status = filters.status;
      }

      let options = {
        where,
        include: [
          {
            model: db.Bike,
            as: 'moto',
            attributes: ['id', 'plate', 'brand', 'model'],
            include: {
              model: db.Client,
              as: 'client',
              attributes: ['id', 'name', 'phone'],
            },
          },
          {
            model: db.WorkOrderItem,
            as: 'items',
            attributes: ['id', 'type', 'description', 'count', 'unitValue'],
          },
        ],
        offset,
        limit,
        order: [['createdAt', 'DESC']],
        subQuery: false,
      };

      // Filtro por placa
      if (filters.plate) {
        options.include[0].where = { plate: { [Op.like]: `%${filters.plate.toUpperCase()}%` } };
      }

      const { rows, count } = await db.WorkOrder.findAndCountAll(options);

      return { data: rows, total: count };
    } catch (error) {
      throw new Error('Error al obtener órdenes de trabajo');
    }
  }

  // Obtener orden por ID
  async getWorkOrderById(id) {
    try {
      const order = await db.WorkOrder.findByPk(id, {
        include: [
          {
            model: db.Bike,
            as: 'moto',
            include: {
              model: db.Client,
              as: 'client',
              attributes: ['id', 'name', 'phone', 'email'],
            },
          },
          {
            model: db.WorkOrderItem,
            as: 'items',
          },
        ],
      });

      if (!order) {
        throw new Error('Orden de trabajo no encontrada');
      }

      return order;
    } catch (error) {
      throw error;
    }
  }

  // Actualizar estado de la orden
  async updateWorkOrderStatus(id, status, note, changedByUserId, userRole) {
    const transaction = await db.sequelize.transaction();

    try {
      const order = await db.WorkOrder.findByPk(id, { transaction });
      if (!order) {
        await transaction.rollback();
        throw new Error('Orden de trabajo no encontrada');
      }

      const fromStatus = order.status;
      
      // Validar cambio idempotente
      if (fromStatus === status) {
        await transaction.rollback();
        const sameStatusError = new Error(`La orden ya se encuentra en estado ${status}`);
        sameStatusError.name = 'InvalidTransitionError';
        throw sameStatusError;
      }

      // Validar estado final (ENTREGADA, CANCELADA) - solo ADMIN puede revertir
      const finalStates = ['ENTREGADA', 'CANCELADA'];
      if (finalStates.includes(fromStatus) && userRole !== 'ADMIN') {
        await transaction.rollback();
        throw new Error(`No se puede cambiar una orden en estado ${fromStatus} si no eres ADMIN`);
      }

      // Validar transiciones lógicas
      const allowedTransitions = STATUS_FLOW[fromStatus] || [];
      if (!allowedTransitions.includes(status)) {
        await transaction.rollback();
        const transitionError = new Error(
          `No se permite cambiar de ${fromStatus} a ${status}. Transiciones válidas desde ${fromStatus}: ${allowedTransitions.length ? allowedTransitions.join(', ') : 'ninguna'}`
        );
        transitionError.name = 'InvalidTransitionError';
        throw transitionError;
      }

      // Actualizar estado
      await order.update({ status }, { transaction });

      // Registrar en historial (fuera de transacción para evitar deadlocks)
      await transaction.commit();

      // Registrar historial después de la transacción
      try {
        await WorkOrderStatusHistoryService.recordStatusChange(
          id,
          fromStatus,
          status,
          note,
          changedByUserId
        );
      } catch (historyError) {
        // Log pero no fallar si el historial falla
        console.error('Error registrando historial:', historyError.message);
      }

      return order;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Agregar item a la orden y actualizar total
  async addItemToWorkOrder(workOrderId, itemData) {
    const transaction = await db.sequelize.transaction();

    try {
      const order = await db.WorkOrder.findByPk(workOrderId, { transaction });
      if (!order) {
        await transaction.rollback();
        throw new Error('Orden de trabajo no encontrada');
      }

      const item = await db.WorkOrderItem.create(
        { ...itemData, workOrderId },
        { transaction }
      );

      // Recalcular total
      const itemTotal = parseFloat(item.count) * parseFloat(item.unitValue);
      const newTotal = parseFloat(order.total) + itemTotal;

      await order.update({ total: newTotal }, { transaction });
      await transaction.commit();

      return item;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Eliminar item de la orden
  async removeItemFromWorkOrder(itemId) {
    const transaction = await db.sequelize.transaction();

    try {
      const item = await db.WorkOrderItem.findByPk(itemId, { transaction });
      if (!item) {
        await transaction.rollback();
        throw new Error('Ítem no encontrado');
      }

      const order = await db.WorkOrder.findByPk(item.workOrderId, { transaction });

      // Restar del total
      const itemTotal = parseFloat(item.count) * parseFloat(item.unitValue);
      const newTotal = Math.max(0, parseFloat(order.total) - itemTotal);

      await order.update({ total: newTotal }, { transaction });
      await item.destroy({ transaction });
      await transaction.commit();

      return { message: 'Ítem eliminado correctamente' };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = new WorkOrderService();
