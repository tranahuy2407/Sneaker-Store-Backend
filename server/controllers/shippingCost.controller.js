import { ShippingCostService } from "../services/shippingCost.service.js";

const service = new ShippingCostService();

export class ShippingCostController {
  static async getAll(req, res) {
    try {
      const { page, limit } = req.query;
      const result = await service.getAll({
        page: Number(page) || 1,
        limit: Number(limit) || 20,
      });

      res.json({
        success: true,
        ...result,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  static async getById(req, res) {
    try {
      const item = await service.getById(req.params.id);
      res.json({ success: true, data: item });
    } catch (err) {
      res.status(404).json({
        success: false,
        message: err.message,
      });
    }
  }

  static async create(req, res) {
    try {
      const item = await service.create(req.body);
      res.status(201).json({
        success: true,
        data: item,
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }

  static async update(req, res) {
    try {
      const item = await service.update(req.params.id, req.body);
      res.json({
        success: true,
        data: item,
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }

  static async delete(req, res) {
    try {
      await service.delete(req.params.id);
      res.json({
        success: true,
        message: "Đã xóa phí vận chuyển",
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }

  // API cho checkout
  static async getCostByName(req, res) {
    try {
      const { name } = req.query;
      const cost = await service.getCostByName(name);
      res.json({ success: true, cost });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
}
