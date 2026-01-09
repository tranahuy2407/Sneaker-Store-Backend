import { Notification } from "../models/index.js";
import { Op } from "sequelize";

const notificationService = {
  /* ================= GET MY NOTIFICATIONS ================= */
  async getMyNotifications({ user, page = 1, limit = 10 }) {
    if (!user?.id) throw new Error("Chưa đăng nhập");

    const offset = (page - 1) * limit;

    const { rows, count } = await Notification.findAndCountAll({
      where: {
        receiver_type: "user",
        receiver_id: user.id,
      },
      order: [["created_at", "DESC"]],
      limit,
      offset,
    });

    return {
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
      },
    };
  },

  /* ================= GET ADMIN NOTIFICATIONS ================= */
  async getAdminNotifications({ page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;

    const { rows, count } = await Notification.findAndCountAll({
      where: {
        receiver_type: "admin",
      },
      order: [["created_at", "DESC"]],
      limit,
      offset,
    });

    return {
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
      },
    };
  },

  /* ================= UNREAD COUNT (BADGE) ================= */
  async getUnreadCount({ user, isAdmin = false }) {
    const where = isAdmin
      ? { receiver_type: "admin", is_read: false }
      : {
          receiver_type: "user",
          receiver_id: user.id,
          is_read: false,
        };

    const count = await Notification.count({ where });
    return count;
  },

  /* ================= MARK ONE AS READ ================= */
  async markAsRead({ id, user, isAdmin = false }) {
    const where = isAdmin
      ? { id, receiver_type: "admin" }
      : { id, receiver_type: "user", receiver_id: user.id };

    const notification = await Notification.findOne({ where });
    if (!notification) throw new Error("Notification không tồn tại");

    await notification.update({ is_read: true });
    return true;
  },

  /* ================= MARK ALL AS READ ================= */
  async markAllAsRead({ user, isAdmin = false }) {
    const where = isAdmin
      ? { receiver_type: "admin", is_read: false }
      : {
          receiver_type: "user",
          receiver_id: user.id,
          is_read: false,
        };

    await Notification.update(
      { is_read: true },
      { where }
    );

    return true;
  },
};

export default notificationService;
