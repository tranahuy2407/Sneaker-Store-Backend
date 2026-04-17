import express from "express";
import { NewsController } from "../controllers/news.controller.js";
import { admin } from "../middlewares/auth.middleware.js";
import { uploadNews } from "../middlewares/upload.middleware.js";
import { cacheMiddleware, clearCache } from "../middlewares/cache.middleware.js";

const newsRouter = express.Router();

// Public routes (cached)
newsRouter.get("/api/v1/news", cacheMiddleware("news:active", 600), NewsController.getActive);
newsRouter.get("/api/v1/news/slug/:slug", cacheMiddleware("news:slug", 600), NewsController.getBySlug);
newsRouter.get("/api/v1/news/:id", cacheMiddleware("news:id", 600), NewsController.getById);

// Admin routes
newsRouter.get("/api/v1/admin/news", admin, NewsController.getAll);
newsRouter.post("/api/v1/admin/news", admin, uploadNews, clearCache("news:*"), NewsController.create);
newsRouter.put("/api/v1/admin/news/:id", admin, uploadNews, clearCache("news:*"), NewsController.update);
newsRouter.delete("/api/v1/admin/news/:id", admin, clearCache("news:*"), NewsController.delete);

export default newsRouter;
