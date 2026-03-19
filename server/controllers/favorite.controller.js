import FavoriteService from "../services/favorite.service.js";

class FavoriteController {
  /**
   * Toggle favorite (Add/Remove)
   */
  async toggleFavorite(req, res) {
    try {
      console.log("FavoriteController.toggleFavorite reached");
      console.log("Headers:", req.headers);
      console.log("Body:", req.body);

      const { productId } = req.body || {};
      const userId = req.user?.id;

      if (!productId) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng cung cấp productId.",
        });
      }

      const result = await FavoriteService.toggleFavorite(userId, productId);

      return res.status(200).json({
        success: true,
        message: result.status === "added" ? "Đã thêm vào danh sách yêu thích." : "Đã xóa khỏi danh sách yêu thích.",
        data: result.data || null,
        status: result.status,
      });
    } catch (error) {
      if (error.message === "PRODUCT_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy sản phẩm.",
        });
      }
      console.error("TOGGLE FAVORITE ERROR:", error);
      res.status(500).json({ success: false, message: "Lỗi máy chủ" });
    }
  }

  /**
   * Get all favorites for a user
   */
  async getFavorites(req, res) {
    try {
      const userId = req.user.id;
      const result = await FavoriteService.getFavorites(userId, req.query);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("GET FAVORITES ERROR:", error);
      res.status(500).json({ success: false, message: "Lỗi máy chủ" });
    }
  }

  /**
   * Check if a product is favorited
   */
  async checkIsFavorited(req, res) {
    try {
      const userId = req.user.id;
      const { productId } = req.params;

      if (!productId) {
        return res.status(400).json({
          success: false,
          message: "Thiếu productId.",
        });
      }

      const isFavorited = await FavoriteService.checkIsFavorited(userId, productId);
      res.status(200).json({
        success: true,
        isFavorited,
      });
    } catch (error) {
      console.error("CHECK IS FAVORITED ERROR:", error);
      res.status(500).json({ success: false, message: "Lỗi máy chủ" });
    }
  }
}

export default new FavoriteController();
