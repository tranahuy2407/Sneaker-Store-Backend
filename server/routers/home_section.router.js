import express from "express";
import { HomeSectionController } from "../controllers/home_section.controller.js";
import { admin } from "../middlewares/auth.middleware.js";
import { uploadHomeSection } from "../middlewares/upload.middleware.js";

const homeSectionRouter = express.Router();

// Public route: Lấy danh sách hiển thị
homeSectionRouter.get("/api/v1/home-sections", HomeSectionController.getActiveSections);

// Admin routes: Quản lý
homeSectionRouter.get("/api/v1/admin/home-sections", admin, HomeSectionController.getAllSections);
homeSectionRouter.post("/api/v1/admin/home-sections", admin, uploadHomeSection, HomeSectionController.createSection);
homeSectionRouter.put("/api/v1/admin/home-sections/:id", admin, uploadHomeSection, HomeSectionController.updateSection);
homeSectionRouter.delete("/api/v1/admin/home-sections/:id", admin, HomeSectionController.deleteSection);

export default homeSectionRouter;
