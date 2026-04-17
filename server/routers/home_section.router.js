import express from "express";
import { HomeSectionController } from "../controllers/home_section.controller.js";
import { admin } from "../middlewares/auth.middleware.js";
import { uploadHomeSection } from "../middlewares/upload.middleware.js";
import { cacheMiddleware, clearCache } from "../middlewares/cache.middleware.js";

const homeSectionRouter = express.Router();

// Public route: Lấy danh sách hiển thị (cached 10 minutes)
homeSectionRouter.get("/api/v1/home-sections", cacheMiddleware("home-sections:active", 600), HomeSectionController.getActiveSections);

// Admin routes: Quản lý
homeSectionRouter.get("/api/v1/admin/home-sections", admin, HomeSectionController.getAllSections);
homeSectionRouter.post("/api/v1/admin/home-sections", admin, uploadHomeSection, clearCache("home-sections:*"), HomeSectionController.createSection);
homeSectionRouter.put("/api/v1/admin/home-sections/:id", admin, uploadHomeSection, clearCache("home-sections:*"), HomeSectionController.updateSection);
homeSectionRouter.delete("/api/v1/admin/home-sections/:id", admin, clearCache("home-sections:*"), HomeSectionController.deleteSection);

export default homeSectionRouter;
