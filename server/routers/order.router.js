import express from "express";
import { OrderController } from "../controllers/order.controller.js"; 
import { guest } from "../middlewares/user.middleware.js"; 

const orderRouter = express.Router();

orderRouter.post("/api/v1/orders", guest, OrderController.checkout);
orderRouter.post("/api/v1/orders/:id/cancel", guest, OrderController.cancel);

export default orderRouter;