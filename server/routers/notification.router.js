import express from "express";
import notificationController from "../controllers/notification.controller.js";
import { user } from "../middlewares/user.middleware.js";
import { admin } from "../middlewares/auth.middleware.js";

const notificationRouter = express.Router();

/* ================= USER ================= */
notificationRouter.get(
  "/api/v1/notifications/my",
  user,
  notificationController.getMyNotifications
);

notificationRouter.get(
  "/api/v1/notifications/my/unread-count",
  user,
  notificationController.getMyUnreadCount
);

notificationRouter.patch(
  "/api/v1/notifications/my/read/:id",
  user,
  notificationController.markAsRead
);

notificationRouter.patch(
  "/api/v1/notifications/my/read-all",
  user,
  notificationController.markAllAsRead
);

/* ================= ADMIN ================= */
notificationRouter.get(
  "/api/v1/notifications/admin",
  admin,
  notificationController.getAdminNotifications
);

notificationRouter.get(
  "/api/v1/notifications/admin/unread-count",
  admin,
  notificationController.getAdminUnreadCount
);

notificationRouter.patch(
  "/api/v1/notifications/admin/read/:id",
  admin,
  notificationController.markAdminAsRead
);

notificationRouter.patch(
  "/api/v1/notifications/admin/read-all",
  admin,
  notificationController.markAllAdminAsRead
);

export default notificationRouter;
