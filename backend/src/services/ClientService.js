const db = require('../models');

class ClientService {
  // Crear cliente
  async createClient(clientData) {
    try {
      const client = await db.Client.create(clientData);
      return client;
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        throw error;
      }
      throw new Error('Error al crear cliente');
    }
  }

  // Obtener todos los clientes con búsqueda
  async getAllClients(searchTerm = '', offset = 0, limit = 10) {
    try {
      const where = {};
      if (searchTerm) {
        const { Op } = require('sequelize');
        where[Op.or] = [
          { name: { [Op.like]: `%${searchTerm}%` } },
          { phone: { [Op.like]: `%${searchTerm}%` } },
          { email: { [Op.like]: `%${searchTerm}%` } },
        ];
      }

      const { rows, count } = await db.Client.findAndCountAll({
        where,
        offset,
        limit,
        order: [['createdAt', 'DESC']],
      });

      return { data: rows, total: count };
    } catch (error) {
      throw new Error('Error al obtener clientes');
    }
  }

  // Obtener cliente por ID con sus motos
  async getClientById(id) {
    try {
      const client = await db.Client.findByPk(id, {
        include: {
          model: db.Bike,
          as: 'bikes',
          attributes: ['id', 'plate', 'brand', 'model', 'cylinder'],
        },
      });

      if (!client) {
        throw new Error('Cliente no encontrado');
      }

      return client;
    } catch (error) {
      throw error;
    }
  }

  // Actualizar cliente
  async updateClient(id, updateData) {
    try {
      const client = await db.Client.findByPk(id);
      if (!client) {
        throw new Error('Cliente no encontrado');
      }

      await client.update(updateData);
      return client;
    } catch (error) {
      throw error;
    }
  }

  // Eliminar cliente
  async deleteClient(id) {
    try {
      const client = await db.Client.findByPk(id);
      if (!client) {
        throw new Error('Cliente no encontrado');
      }

      await client.destroy();
      return { message: 'Cliente eliminado correctamente' };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ClientService();
