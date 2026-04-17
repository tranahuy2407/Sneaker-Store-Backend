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
import { cacheMiddleware, clearCacheByNamespace, CACHE_NAMESPACES, CACHE_ACTIONS, CACHE_TTL } from "../middlewares/cache.middleware.js";

const brandRouter = express.Router();

brandRouter.get("/api/v1/brands", cacheMiddleware(CACHE_NAMESPACES.BRANDS, CACHE_ACTIONS.LIST, CACHE_TTL.LONG), getAllBrands);
brandRouter.get("/api/v1/brands/:slug", cacheMiddleware(CACHE_NAMESPACES.BRANDS, CACHE_ACTIONS.SLUG, CACHE_TTL.LONG), getBrandBySlug);
brandRouter.get("/api/v1/brands/id/:id", cacheMiddleware(CACHE_NAMESPACES.BRANDS, CACHE_ACTIONS.BY_ID, CACHE_TTL.LONG), getBrandById);
brandRouter.get("/api/v1/brands/:slug/products", cacheMiddleware(CACHE_NAMESPACES.BRANDS, CACHE_ACTIONS.PRODUCTS, CACHE_TTL.MEDIUM), getBrandProductsBySlug);

brandRouter.post(
  "/api/v1/brands",
  admin,
  uploadBrand,
  clearCacheByNamespace(CACHE_NAMESPACES.BRANDS),
  createBrand
);
brandRouter.put(
  "/api/v1/brands/:id",
  admin,
  uploadBrand,
  clearCacheByNamespace(CACHE_NAMESPACES.BRANDS),
  updateBrand
);
brandRouter.delete("/api/v1/brands/:id", admin, clearCacheByNamespace(CACHE_NAMESPACES.BRANDS), deleteBrand);

export default brandRouter;
