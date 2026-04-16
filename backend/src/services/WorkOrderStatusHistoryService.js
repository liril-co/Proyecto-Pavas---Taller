const db = require('../models');

class WorkOrderStatusHistoryService {
  // Registrar cambio de estado
  async recordStatusChange(workOrderId, fromStatus, toStatus, note, changedByUserId) {
    try {
      // Validar que no sea un cambio idempotente
      if (fromStatus === toStatus) {
        return null; // No registrar cambios idempotentes
      }

      // Crear registro
      const history = await db.WorkOrderStatusHistory.create({
        workOrderId,
        fromStatus,
        toStatus,
        note: note || null,
        changedByUserId,
      });

      return history;
    } catch (error) {
      throw error;
    }
  }

  // Obtener historial de una orden
  async getWorkOrderHistory(workOrderId) {
    try {
      const history = await db.WorkOrderStatusHistory.findAll({
        where: { workOrderId },
        include: {
          model: db.User,
          as: 'changedByUser',
          attributes: ['id', 'name', 'email'],
        },
        order: [['createdAt', 'DESC']],
      });

      return history;
    } catch (error) {
      throw new Error('Error al obtener historial de estado');
    }
  }

  // Validar cambio de estado permitido
  validateStatusTransition(currentStatus, newStatus, userRole) {
    // Estados finales: ENTREGADA, CANCELADA
    const finalStates = ['ENTREGADA', 'CANCELADA'];

    // Si está en estado final y el usuario no es ADMIN, no permitir cambios
    if (finalStates.includes(currentStatus) && userRole !== 'ADMIN') {
      throw new Error(`No se puede cambiar una orden en estado ${currentStatus} si no eres ADMIN`);
    }

    // Validar transiciones lógicas
    const validTransitions = {
      'RECIBIDA': ['DIAGNOSTICO', 'CANCELADA'],
      'DIAGNOSTICO': ['EN_PROCESO', 'RECIBIDA', 'CANCELADA'],
      'EN_PROCESO': ['LISTA', 'DIAGNOSTICO', 'CANCELADA'],
      'LISTA': ['ENTREGADA', 'EN_PROCESO', 'CANCELADA'],
      'ENTREGADA': [], // No permitir cambios (solo ADMIN)
      'CANCELADA': [], // No permitir cambios
    };

    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      throw new Error(`Transición inválida: ${currentStatus} → ${newStatus}`);
    }

    return true;
  }
}

module.exports = new WorkOrderStatusHistoryService();
