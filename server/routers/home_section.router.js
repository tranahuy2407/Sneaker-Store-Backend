import express from "express";
import { HomeSectionController } from "../controllers/home_section.controller.js";
import { admin } from "../middlewares/auth.middleware.js";
import { uploadHomeSection } from "../middlewares/upload.middleware.js";
import { cacheMiddleware, clearCacheByNamespace, CACHE_NAMESPACES, CACHE_ACTIONS, CACHE_TTL } from "../middlewares/cache.middleware.js";

const homeSectionRouter = express.Router();

homeSectionRouter.get("/api/v1/home-sections", cacheMiddleware(CACHE_NAMESPACES.HOME_SECTIONS, CACHE_ACTIONS.ACTIVE, CACHE_TTL.LONG), HomeSectionController.getActiveSections);

homeSectionRouter.get("/api/v1/admin/home-sections", admin, HomeSectionController.getAllSections);
homeSectionRouter.post("/api/v1/admin/home-sections", admin, uploadHomeSection, clearCacheByNamespace(CACHE_NAMESPACES.HOME_SECTIONS), HomeSectionController.createSection);
homeSectionRouter.put("/api/v1/admin/home-sections/:id", admin, uploadHomeSection, clearCacheByNamespace(CACHE_NAMESPACES.HOME_SECTIONS), HomeSectionController.updateSection);
homeSectionRouter.delete("/api/v1/admin/home-sections/:id", admin, clearCacheByNamespace(CACHE_NAMESPACES.HOME_SECTIONS), HomeSectionController.deleteSection);

export default homeSectionRouter;
