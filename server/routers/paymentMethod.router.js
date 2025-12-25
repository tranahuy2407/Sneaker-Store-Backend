
import express from "express";
import { uploadPaymentLogo } from "../middlewares/upload.middleware.js";
import { admin } from "../middlewares/auth.middleware.js";
import {
  getAllPaymentMethods,
  getPaymentMethodById,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} from "../controllers/paymentMethod.controller.js";

const paymentRouter = express.Router();

paymentRouter.get("/api/v1/payment-methods", getAllPaymentMethods);
paymentRouter.get("/api/v1/payment-methods/:id", getPaymentMethodById);
paymentRouter.post(
  "/api/v1/payment-methods",
  admin,
  uploadPaymentLogo, 
  createPaymentMethod
);
paymentRouter.put(
  "/api/v1/payment-methods/:id",
  admin,
  uploadPaymentLogo, 
  updatePaymentMethod
);
paymentRouter.delete("/api/v1/payment-methods/:id", admin, deletePaymentMethod);

export default paymentRouter;
