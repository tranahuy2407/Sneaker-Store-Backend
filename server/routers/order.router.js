import express from "express";
import { OrderController } from "../controllers/order.controller.js"; 
import { guest, user } from "../middlewares/user.middleware.js"; 
import { admin } from "../middlewares/auth.middleware.js";

const orderRouter = express.Router();

orderRouter.post("/api/v1/orders", guest, OrderController.checkout);
orderRouter.post("/api/v1/orders/:id/cancel", guest, OrderController.cancel);
orderRouter.get(
  "/api/v1/admin/orders",
  admin,
  OrderController.getAll
);

orderRouter.get(
  "/api/v1/admin/orders/:id",
  admin,
  OrderController.getDetail
);

orderRouter.put(
  "/api/v1/admin/orders/:id/status",
  admin,
  OrderController.updateStatus
);

orderRouter.get("/api/v1/orders/me", user, OrderController.getMyOrders);
orderRouter.get("/api/v1/orders/me/:id", user, OrderController.getMyOrderDetail);

export default orderRouter;