import express from "express";
import {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
  getCategoryProducts,
} from "../controllers/category.controller.js";
import { admin } from "../middlewares/auth.middleware.js";
import { uploadCategory } from "../middlewares/upload.middleware.js";
import { cacheMiddleware, clearCacheByNamespace, CACHE_NAMESPACES, CACHE_ACTIONS, CACHE_TTL } from "../middlewares/cache.middleware.js";

const categoryRouter = express.Router();

// sneaker:categories:list:{params}
categoryRouter.get("/api/v1/categories", cacheMiddleware(CACHE_NAMESPACES.CATEGORIES, CACHE_ACTIONS.LIST, CACHE_TTL.LONG), getAllCategories);
// sneaker:categories:slug:{slug}
categoryRouter.get("/api/v1/categories/:slug", cacheMiddleware(CACHE_NAMESPACES.CATEGORIES, CACHE_ACTIONS.SLUG, CACHE_TTL.LONG), getCategoryBySlug);
// sneaker:categories:by-id:{id}
categoryRouter.get("/api/v1/categories/id/:id", cacheMiddleware(CACHE_NAMESPACES.CATEGORIES, CACHE_ACTIONS.BY_ID, CACHE_TTL.LONG), getCategoryById);
// sneaker:categories:products:{slug}:{params}
categoryRouter.get("/api/v1/categories/:slug/products", cacheMiddleware(CACHE_NAMESPACES.CATEGORIES, CACHE_ACTIONS.PRODUCTS, CACHE_TTL.MEDIUM), getCategoryProducts);

categoryRouter.post(
  "/api/v1/categories",
  admin,
  uploadCategory,
  clearCacheByNamespace(CACHE_NAMESPACES.CATEGORIES),
  createCategory
);
categoryRouter.put(
  "/api/v1/categories/:id",
  admin,
  uploadCategory,
  clearCacheByNamespace(CACHE_NAMESPACES.CATEGORIES),
  updateCategory
);
categoryRouter.delete("/api/v1/categories/:id", admin, clearCacheByNamespace(CACHE_NAMESPACES.CATEGORIES), deleteCategory);

export default categoryRouter;
