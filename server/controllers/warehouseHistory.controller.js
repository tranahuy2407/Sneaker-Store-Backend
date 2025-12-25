import { WarehouseHistoryService } from "../services/warehouseHistory.service.js";

// GET ALL
export const getAllWarehouseHistories = async (req, res) => {
  try {
    const { page, limit, sizeId, productId } = req.query;

    const result = await WarehouseHistoryService.getAll({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      sizeId,
      productId,
    });

    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET BY ID
export const getWarehouseHistoryById = async (req, res) => {
  try {
    const history = await WarehouseHistoryService.getById(req.params.id);

    if (!history)
      return res.status(404).json({ success: false, message: "Not found" });

    res.status(200).json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE
export const createWarehouseHistory = async (req, res) => {
  try {
    const { size_id, change_quantity } = req.body;

    if (!req.admin?.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const history = await WarehouseHistoryService.create({
      size_id,
      change_quantity,
      admin_id: req.admin.id,
    });

    res.status(201).json({ success: true, data: history });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// UPDATE
export const updateWarehouseHistory = async (req, res) => {
  try {
    if (!req.admin?.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const updated = await WarehouseHistoryService.update(req.params.id, req.body);

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE
export const deleteWarehouseHistory = async (req, res) => {
  try {
    if (!req.admin?.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    await WarehouseHistoryService.delete(req.params.id);

    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
