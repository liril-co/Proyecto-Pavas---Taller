const db = require('../models');
const { Op } = require('sequelize');

class BikeService {
  // Crear moto
  async createBike(bikeData) {
    try {
      // Verificar que el cliente existe
      const client = await db.Client.findByPk(bikeData.clientId);
      if (!client) {
        const error = new Error('Cliente no encontrado');
        error.name = 'SequelizeForeignKeyConstraintError';
        throw error;
      }

      const bike = await db.Bike.create(bikeData);
      return bike;
    } catch (error) {
      throw error;
    }
  }

  // Obtener motos con búsqueda por placa
  async getAllBikes(plate = '', offset = 0, limit = 10) {
    try {
      const where = {};
      if (plate) {
        where.plate = { [Op.like]: `%${plate.toUpperCase()}%` };
      }

      const { rows, count } = await db.Bike.findAndCountAll({
        where,
        include: {
          model: db.Client,
          as: 'client',
          attributes: ['id', 'name', 'phone'],
        },
        offset,
        limit,
        order: [['createdAt', 'DESC']],
      });

      return { data: rows, total: count };
    } catch (error) {
      throw new Error('Error al obtener motos');
    }
  }

  // Obtener moto por ID con órdenes
  async getBikeById(id) {
    try {
      const bike = await db.Bike.findByPk(id, {
        include: [
          {
            model: db.Client,
            as: 'client',
            attributes: ['id', 'name', 'phone', 'email'],
          },
          {
            model: db.WorkOrder,
            as: 'workOrders',
            attributes: ['id', 'status', 'entryDate', 'total'],
          },
        ],
      });

      if (!bike) {
        throw new Error('Moto no encontrada');
      }

      return bike;
    } catch (error) {
      throw error;
    }
  }

  // Actualizar moto
  async updateBike(id, updateData) {
    try {
      const bike = await db.Bike.findByPk(id);
      if (!bike) {
        throw new Error('Moto no encontrada');
      }

      await bike.update(updateData);
      return bike;
    } catch (error) {
      throw error;
    }
  }

  // Eliminar moto
  async deleteBike(id) {
    try {
      const bike = await db.Bike.findByPk(id);
      if (!bike) {
        throw new Error('Moto no encontrada');
      }

      await bike.destroy();
      return { message: 'Moto eliminada correctamente' };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new BikeService();
