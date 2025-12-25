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

const categoryRouter = express.Router();

categoryRouter.get("/api/v1/categories", getAllCategories);
categoryRouter.get("/api/v1/categories/:slug", getCategoryBySlug);
categoryRouter.get("/api/v1/categories/id/:id", getCategoryById);
categoryRouter.post(
  "/api/v1/categories",
  admin,
  uploadCategory,
  createCategory
);
categoryRouter.put(
  "/api/v1/categories/:id",
  admin,
  uploadCategory,
  updateCategory
);
categoryRouter.delete("/api/v1/categories/:id", admin, deleteCategory);
categoryRouter.get("/api/v1/categories/:slug/products", getCategoryProducts);

export default categoryRouter;
