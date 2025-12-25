import express from "express";
import {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  refreshAdminToken,
  getAdminProfile,
  getAdminById,
} from "../controllers/admin.controller.js";
import { admin } from "../middlewares/auth.middleware.js";

const adminRouter = express.Router();

// Public routes
adminRouter.post("/api/v1/admin/register", registerAdmin);
adminRouter.post("/api/v1/admin/login", loginAdmin);
adminRouter.post("/api/v1/admin/refresh-token", refreshAdminToken);

// Protected routes
adminRouter.post("/api/v1/admin/logout", admin, logoutAdmin);
adminRouter.get("/api/v1/admin/profile", admin, getAdminProfile);
adminRouter.get("/api/v1/admin/id/:id", admin, getAdminById);
export default adminRouter;
