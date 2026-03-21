import express from "express";
import { NewsController } from "../controllers/news.controller.js";
import { admin } from "../middlewares/auth.middleware.js";
import { uploadNews } from "../middlewares/upload.middleware.js";

const newsRouter = express.Router();

// Public routes
newsRouter.get("/api/v1/news", NewsController.getActive);
newsRouter.get("/api/v1/news/slug/:slug", NewsController.getBySlug);
newsRouter.get("/api/v1/news/:id", NewsController.getById);

// Admin routes
newsRouter.get("/api/v1/admin/news", admin, NewsController.getAll);
newsRouter.post("/api/v1/admin/news", admin, uploadNews, NewsController.create);
newsRouter.put("/api/v1/admin/news/:id", admin, uploadNews, NewsController.update);
newsRouter.delete("/api/v1/admin/news/:id", admin, NewsController.delete);

export default newsRouter;
