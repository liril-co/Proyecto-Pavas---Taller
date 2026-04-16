const WorkOrderStatusHistoryService = require('../services/WorkOrderStatusHistoryService');

class WorkOrderStatusHistoryController {
  async getWorkOrderHistory(req, res, next) {
    try {
      const { id } = req.params;

      const history = await WorkOrderStatusHistoryService.getWorkOrderHistory(id);

      res.status(200).json({
        success: true,
        data: history,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new WorkOrderStatusHistoryController();
