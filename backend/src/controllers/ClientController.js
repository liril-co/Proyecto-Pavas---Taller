const ClientService = require('../services/ClientService');

class ClientController {
  async createClient(req, res, next) {
    try {
      const client = await ClientService.createClient(req.body);
      res.status(201).json({
        success: true,
        message: 'Cliente creado correctamente',
        data: client,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllClients(req, res, next) {
    try {
      const { search = '', page = 1, pageSize = 10 } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(pageSize);
      const limit = parseInt(pageSize);

      const { data, total } = await ClientService.getAllClients(search, offset, limit);

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

  async getClientById(req, res, next) {
    try {
      const client = await ClientService.getClientById(req.params.id);
      res.status(200).json({
        success: true,
        data: client,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateClient(req, res, next) {
    try {
      const client = await ClientService.updateClient(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Cliente actualizado correctamente',
        data: client,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteClient(req, res, next) {
    try {
      await ClientService.deleteClient(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Cliente eliminado correctamente',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ClientController();
