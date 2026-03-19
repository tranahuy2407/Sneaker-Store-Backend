import RecentlyViewedService from "../services/recentlyViewed.service.js";

class RecentlyViewedController {
  /**
   * Record a product view
   */
  async addView(req, res) {
    try {
      const { productId } = req.body;
      const userId = req.user.id;

      if (!productId) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng cung cấp productId.",
        });
      }

      await RecentlyViewedService.addView(userId, productId);

      return res.status(200).json({
        success: true,
        message: "Đã lưu vào lịch sử xem.",
      });
    } catch (error) {
      if (error.message === "PRODUCT_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy sản phẩm.",
        });
      }
      console.error("ADD RECENTLY VIEWED ERROR:", error);
      res.status(500).json({ success: false, message: "Lỗi máy chủ" });
    }
  }

  /**
   * Get recently viewed history
   */
  async getRecentlyViewed(req, res) {
    try {
      const userId = req.user.id;
      const result = await RecentlyViewedService.getRecentlyViewed(userId, req.query);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("GET RECENTLY VIEWED ERROR:", error);
      res.status(500).json({ success: false, message: "Lỗi máy chủ" });
    }
  }
}

export default new RecentlyViewedController();
