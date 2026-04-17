import express from "express";
import { NewsController } from "../controllers/news.controller.js";
import { admin } from "../middlewares/auth.middleware.js";
import { uploadNews } from "../middlewares/upload.middleware.js";
import { cacheMiddleware, clearCacheByNamespace, CACHE_NAMESPACES, CACHE_ACTIONS, CACHE_TTL } from "../middlewares/cache.middleware.js";

const newsRouter = express.Router();

// sneaker:news:active:{params}
newsRouter.get("/api/v1/news", cacheMiddleware(CACHE_NAMESPACES.NEWS, CACHE_ACTIONS.ACTIVE, CACHE_TTL.LONG), NewsController.getActive);
// sneaker:news:slug:{slug}
newsRouter.get("/api/v1/news/slug/:slug", cacheMiddleware(CACHE_NAMESPACES.NEWS, CACHE_ACTIONS.SLUG, CACHE_TTL.LONG), NewsController.getBySlug);
// sneaker:news:by-id:{id}
newsRouter.get("/api/v1/news/:id", cacheMiddleware(CACHE_NAMESPACES.NEWS, CACHE_ACTIONS.BY_ID, CACHE_TTL.LONG), NewsController.getById);

// Admin routes
newsRouter.get("/api/v1/admin/news", admin, NewsController.getAll);
newsRouter.post("/api/v1/admin/news", admin, uploadNews, clearCacheByNamespace(CACHE_NAMESPACES.NEWS), NewsController.create);
newsRouter.put("/api/v1/admin/news/:id", admin, uploadNews, clearCacheByNamespace(CACHE_NAMESPACES.NEWS), NewsController.update);
newsRouter.delete("/api/v1/admin/news/:id", admin, clearCacheByNamespace(CACHE_NAMESPACES.NEWS), NewsController.delete);

export default newsRouter;
