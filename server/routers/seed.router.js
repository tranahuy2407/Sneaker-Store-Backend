import express from "express";
import { runSeed, getSeedStatus } from "../controllers/seed.controller.js";

const seedRouter = express.Router();

/**
 * POST /api/seed?secret=YOUR_SECRET
 * Trigger seed full database (chạy background, trả về ngay)
 */
seedRouter.post("/api/seed", runSeed);

/**
 * GET /api/seed/status
 * Kiểm tra seed có đang chạy không
 */
seedRouter.get("/api/seed/status", getSeedStatus);

export default seedRouter;
