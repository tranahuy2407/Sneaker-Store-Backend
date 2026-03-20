import express from "express";
import { OrderController } from "../controllers/order.controller.js"; 
import { PaymentController } from "../controllers/payment.controller.js";
import { guest, user } from "../middlewares/user.middleware.js"; 
import { admin } from "../middlewares/auth.middleware.js";

const orderRouter = express.Router();

orderRouter.post("/api/v1/orders", guest, OrderController.checkout);
orderRouter.put("/api/v1/orders/:id/cancel", guest, OrderController.cancel);

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
orderRouter.get("/api/v1/orders/history", user, OrderController.getHistory);
orderRouter.get("/api/v1/orders/me/:id", user, OrderController.getMyOrderDetail);
orderRouter.put("/api/v1/orders/:id/reset", user, OrderController.resetOrder);

// ZaloPay Routes
orderRouter.post("/api/v1/orders/zalopay", guest, PaymentController.createZaloPayOrder);
orderRouter.post("/api/v1/orders/zalopay-callback", PaymentController.zalopayCallback);
orderRouter.get("/api/v1/orders/zalopay-status/:app_trans_id", guest, PaymentController.queryStatus);
orderRouter.get("/api/v1/orders/zalopay-refund-status/:m_refund_id", guest, PaymentController.queryRefundStatus);

export default orderRouter;