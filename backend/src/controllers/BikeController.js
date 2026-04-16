const BikeService = require('../services/BikeService');

class BikeController {
  async createBike(req, res, next) {
    try {
      const bike = await BikeService.createBike(req.body);
      res.status(201).json({
        success: true,
        message: 'Moto creada correctamente',
        data: bike,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllBikes(req, res, next) {
    try {
      const { plate = '', page = 1, pageSize = 10 } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(pageSize);
      const limit = parseInt(pageSize);

      const { data, total } = await BikeService.getAllBikes(plate, offset, limit);

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

  async getBikeById(req, res, next) {
    try {
      const bike = await BikeService.getBikeById(req.params.id);
      res.status(200).json({
        success: true,
        data: bike,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateBike(req, res, next) {
    try {
      const bike = await BikeService.updateBike(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Moto actualizada correctamente',
        data: bike,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteBike(req, res, next) {
    try {
      await BikeService.deleteBike(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Moto eliminada correctamente',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BikeController();
