import express from "express";
import { DashboardController } from "../controllers/dashboard.controller.js";
import { admin } from "../middlewares/auth.middleware.js";

const dashboardRouter = express.Router();

// Admin routes cho thống kê & báo cáo
dashboardRouter.get("/api/v1/admin/dashboard/statistics", admin, DashboardController.getStatistics);
dashboardRouter.get("/api/v1/admin/dashboard/revenue-chart", admin, DashboardController.getRevenueChart);
dashboardRouter.get("/api/v1/admin/dashboard/top-products", admin, DashboardController.getTopProducts);

export default dashboardRouter;
