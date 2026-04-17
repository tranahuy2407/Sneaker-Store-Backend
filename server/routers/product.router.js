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
import { cacheMiddleware, clearCacheByNamespace, CACHE_NAMESPACES, CACHE_ACTIONS, CACHE_TTL } from "../middlewares/cache.middleware.js";

const productRouter = express.Router();

productRouter.get("/api/v1/products", cacheMiddleware(CACHE_NAMESPACES.PRODUCTS, CACHE_ACTIONS.LIST, CACHE_TTL.MEDIUM), getAllProducts);
productRouter.get("/api/v1/products/:slug", cacheMiddleware(CACHE_NAMESPACES.PRODUCTS, CACHE_ACTIONS.SLUG, CACHE_TTL.LONG), getProductBySlug);
productRouter.get("/api/v1/products/id/:id", cacheMiddleware(CACHE_NAMESPACES.PRODUCTS, CACHE_ACTIONS.BY_ID, CACHE_TTL.LONG), getProductById);
productRouter.post("/api/v1/products", admin, uploadProductImages, clearCacheByNamespace(CACHE_NAMESPACES.PRODUCTS), createProduct);
productRouter.put("/api/v1/products/:id", admin, uploadProductImages, clearCacheByNamespace(CACHE_NAMESPACES.PRODUCTS), updateProduct);
productRouter.delete("/api/v1/products/:id", admin, clearCacheByNamespace(CACHE_NAMESPACES.PRODUCTS), deleteProduct);

export default productRouter;
