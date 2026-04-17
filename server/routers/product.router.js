import express from "express";
import {
  getAllProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/product.controller.js";
import { uploadProductImages } from "../middlewares/upload.middleware.js";
import { admin } from "../middlewares/auth.middleware.js";
import { cacheMiddleware, clearCache } from "../middlewares/cache.middleware.js";

const productRouter = express.Router();

// Public routes (cached)
productRouter.get("/api/v1/products", cacheMiddleware("products:list", 300), getAllProducts);
productRouter.get("/api/v1/products/:slug", cacheMiddleware("products:slug", 600), getProductBySlug);
productRouter.get("/api/v1/products/id/:id", cacheMiddleware("products:id", 600), getProductById);

// Protected routes (clear cache on write)
productRouter.post("/api/v1/products", admin, uploadProductImages, clearCache("products:*"), createProduct);
productRouter.put("/api/v1/products/:id", admin, uploadProductImages, clearCache("products:*"), updateProduct);
productRouter.delete("/api/v1/products/:id", admin, clearCache("products:*"), deleteProduct);

export default productRouter;
