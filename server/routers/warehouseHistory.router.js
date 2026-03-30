import express from "express";
import {
  getAllWarehouseHistories,
  getWarehouseHistoryById,
  createWarehouseHistory,
  updateWarehouseHistory,
  deleteWarehouseHistory,
  importWarehouseExcel,
} from "../controllers/warehouseHistory.controller.js";
import { admin } from "../middlewares/auth.middleware.js";
import { uploadExcel } from "../middlewares/upload.middleware.js";

const warehouseHistoryRouter = express.Router();

// Public routes
warehouseHistoryRouter.get(
  "/api/v1/warehouse-histories",
  getAllWarehouseHistories
);
warehouseHistoryRouter.get(
  "/api/v1/warehouse-histories/:id",
  getWarehouseHistoryById
);

warehouseHistoryRouter.post(
  "/api/v1/warehouse-histories/import-excel",
  admin,
  uploadExcel,
  importWarehouseExcel
);

warehouseHistoryRouter.post(
  "/api/v1/warehouse-histories",
  admin,
  createWarehouseHistory
);
warehouseHistoryRouter.put(
  "/api/v1/warehouse-histories/:id",
  admin,
  updateWarehouseHistory
);
warehouseHistoryRouter.delete(
  "/api/v1/warehouse-histories/:id",
  admin,
  deleteWarehouseHistory
);

export default warehouseHistoryRouter;
