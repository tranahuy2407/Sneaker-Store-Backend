import express from "express";
import {
  getAllBrands,
  getBrandBySlug,
  createBrand,
  updateBrand,
  deleteBrand,
  getBrandById,
  getBrandProductsBySlug,
} from "../controllers/brand.controller.js";
import { admin } from "../middlewares/auth.middleware.js";
import { uploadBrand } from "../middlewares/upload.middleware.js";
import { cacheMiddleware, clearCache } from "../middlewares/cache.middleware.js";
 
const brandRouter = express.Router();
 
brandRouter.get("/api/v1/brands", cacheMiddleware("brands:list", 600), getAllBrands);
brandRouter.get("/api/v1/brands/:slug", cacheMiddleware("brands:slug", 600), getBrandBySlug);
brandRouter.get("/api/v1/brands/id/:id", cacheMiddleware("brands:id", 600), getBrandById);
brandRouter.get("/api/v1/brands/:slug/products", cacheMiddleware("brands:products", 300), getBrandProductsBySlug);
brandRouter.post(
  "/api/v1/brands",
  admin,
  uploadBrand,
  clearCache("brands:*"),
  createBrand
);
brandRouter.put(
  "/api/v1/brands/:id",
  admin,
  uploadBrand,
  clearCache("brands:*"),
  updateBrand
);
brandRouter.delete("/api/v1/brands/:id", admin, clearCache("brands:*"), deleteBrand);

export default brandRouter;
