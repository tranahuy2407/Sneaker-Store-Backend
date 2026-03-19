import express from "express";
import {
  getAllPromotions,
  getPromotionById,
  createPromotion,
  updatePromotion,
  deletePromotion,
  addCouponsToPromotion,
  getActivePromotions,
  addProductsToPromotion,
  removeProductsFromPromotion,
} from "../controllers/promotion.controller.js";

import { admin } from "../middlewares/auth.middleware.js";
import { uploadPromotion } from "../middlewares/upload.middleware.js";

const promotionRouter = express.Router();

// Public
promotionRouter.get("/api/v1/promotions/client/active", getActivePromotions);
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

promotionRouter.post(
  "/api/v1/promotions/:id/coupons",
  admin,
  addCouponsToPromotion
);

promotionRouter.post(
  "/api/v1/promotions/:id/products",
  admin,
  addProductsToPromotion
);

// Gỡ sản phẩm khỏi promotion
promotionRouter.delete(
  "/api/v1/promotions/:id/products",
  admin,
  removeProductsFromPromotion
);

export default promotionRouter;
