import notificationService from "../services/notification.service.js";

const notificationController = {
  /* ================= USER ================= */
  async getMyNotifications(req, res, next) {
    try {
      const result = await notificationService.getMyNotifications({
        user: req.user,
        page: req.query.page,
        limit: req.query.limit,
      });
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async getMyUnreadCount(req, res, next) {
    try {
      const count = await notificationService.getUnreadCount({
        user: req.user,
      });
      res.json({ count });
    } catch (err) {
      next(err);
    }
  },

  async markAsRead(req, res, next) {
    try {
      await notificationService.markAsRead({
        id: req.params.id,
        user: req.user,
      });
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  },

  async markAllAsRead(req, res, next) {
    try {
      await notificationService.markAllAsRead({
        user: req.user,
      });
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  },

  /* ================= ADMIN ================= */
  async getAdminNotifications(req, res, next) {
    try {
      const result = await notificationService.getAdminNotifications({
        page: req.query.page,
        limit: req.query.limit,
      });
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async getAdminUnreadCount(req, res, next) {
    try {
      const count = await notificationService.getUnreadCount({
        isAdmin: true,
      });
      res.json({ count });
    } catch (err) {
      next(err);
    }
  },

  async markAdminAsRead(req, res, next) {
    try {
      await notificationService.markAsRead({
        id: req.params.id,
        isAdmin: true,
      });
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  },

  async markAllAdminAsRead(req, res, next) {
    try {
      await notificationService.markAllAsRead({
        isAdmin: true,
      });
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  },
};

export default notificationController;
