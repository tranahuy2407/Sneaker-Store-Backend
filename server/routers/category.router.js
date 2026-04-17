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
import { cacheMiddleware, clearCache } from "../middlewares/cache.middleware.js";

const categoryRouter = express.Router();

categoryRouter.get("/api/v1/categories", cacheMiddleware("categories:list", 600), getAllCategories);
categoryRouter.get("/api/v1/categories/:slug", cacheMiddleware("categories:slug", 600), getCategoryBySlug);
categoryRouter.get("/api/v1/categories/id/:id", cacheMiddleware("categories:id", 600), getCategoryById);
categoryRouter.post(
  "/api/v1/categories",
  admin,
  uploadCategory,
  clearCache("categories:*"),
  createCategory
);
categoryRouter.put(
  "/api/v1/categories/:id",
  admin,
  uploadCategory,
  clearCache("categories:*"),
  updateCategory
);
categoryRouter.delete("/api/v1/categories/:id", admin, clearCache("categories:*"), deleteCategory);
categoryRouter.get("/api/v1/categories/:slug/products", cacheMiddleware("categories:products", 300), getCategoryProducts);

export default categoryRouter;
