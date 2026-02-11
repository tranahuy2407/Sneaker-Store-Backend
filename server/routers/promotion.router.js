import express from "express";
import {
  getAllPromotions,
  getPromotionById,
  createPromotion,
  updatePromotion,
  deletePromotion,
  addCouponsToPromotion,
} from "../controllers/promotion.controller.js";

import { admin } from "../middlewares/auth.middleware.js";
import { uploadPromotion } from "../middlewares/upload.middleware.js";

const promotionRouter = express.Router();

// Public
promotionRouter.get("/api/v1/promotions", getAllPromotions);
promotionRouter.get("/api/v1/promotions/:id", getPromotionById);

// Admin
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

// Gán coupon vào promotion
promotionRouter.post(
  "/api/v1/promotions/:id/coupons",
  admin,
  addCouponsToPromotion
);

export default promotionRouter;
