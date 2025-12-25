import express from "express";
import {
  getAllPromotions,
  getPromotionById,
  createPromotion,
  updatePromotion,
  deletePromotion,
} from "../controllers/promotion.controller.js";
import { admin } from "../middlewares/auth.middleware.js";
import { uploadPromotion } from "../middlewares/upload.middleware.js";

const promotionRouter = express.Router();

// Public routes
promotionRouter.get("/api/v1/promotions", getAllPromotions);
promotionRouter.get("/api/v1/promotions/:id", getPromotionById);

// Protected routes
promotionRouter.post(
  "/api/v1/promotions",
  admin,
  uploadPromotion,
  createPromotion
);
promotionRouter.put(
  "/api/v1/promotions/:id",
  admin,
  uploadPromotion,
  updatePromotion
);
promotionRouter.delete(
  "/api/v1/promotions/:id",
  admin,
  deletePromotion
);

export default promotionRouter;
