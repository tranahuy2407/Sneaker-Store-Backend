import ReviewService from "../services/review.service.js";

class ReviewController {
  /**
   * Thêm bình luận và đánh giá sản phẩm (Dành cho User)
   */
  async addReview(req, res) {
    try {
      const { productId, rating, content } = req.body;
      const userId = req.user.id;

      if (!productId || !rating || !content) {
        return res.status(400).json({ 
          success: false, 
          message: "Vui lòng cung cấp đủ productId, rating và content." 
        });
      }

      const review = await ReviewService.addReview(
        userId,
        productId,
        rating,
        content
      );

      res.status(201).json({
        success: true,
        message: "Đánh giá sản phẩm thành công.",
        data: review,
      });
    } catch (error) {
      if (error.message === "NOT_PURCHASED") {
        return res.status(403).json({
          success: false,
          message: "Bạn chưa mua sản phẩm này hoặc đơn hàng chưa hoàn thành.",
        });
      }
      if (error.message === "ALREADY_REVIEWED") {
        return res.status(400).json({
          success: false,
          message: "Bạn đã đánh giá sản phẩm này rồi.",
        });
      }
      if (error.message === "RATING_INVALID") {
        return res.status(400).json({
          success: false,
          message: "Số sao đánh giá không hợp lệ (từ 1 đến 5).",
        });
      }
      if (error.message === "CONTENT_REQUIRED") {
        return res.status(400).json({
          success: false,
          message: "Nội dung đánh giá không được để trống.",
        });
      }

      console.error("ADD REVIEW ERROR:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Lấy danh sách đánh giá của 1 sản phẩm (Public)
   */
  async getReviewsByProduct(req, res) {
    try {
      const { productId } = req.params;
      if (!productId) {
        return res.status(400).json({ 
          success: false, 
          message: "Thiếu productId" 
        });
      }

      const result = await ReviewService.getReviewsByProduct(productId, req.query);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("GET REVIEWS BY PRODUCT ERROR:", error);
      res.status(500).json({ success: false, message: "Lỗi máy chủ" });
    }
  }

  /**
   * Lấy toàn bộ đánh giá trên hệ thống (Admin)
   */
  async getAllReviews(req, res) {
    try {
      const result = await ReviewService.getAllReviews(req.query);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("GET ALL REVIEWS ERROR:", error);
      res.status(500).json({ success: false, message: "Lỗi máy chủ" });
    }
  }

  /**
   * Xóa một đánh giá (Admin)
   */
  async deleteReview(req, res) {
    try {
      const { id } = req.params;
      
      await ReviewService.deleteReview(id);
      
      res.status(200).json({
        success: true,
        message: "Xóa đánh giá thành công.",
      });
    } catch (error) {
      if (error.message === "REVIEW_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy đánh giá.",
        });
      }
      console.error("DELETE REVIEW ERROR:", error);
      res.status(500).json({ success: false, message: "Lỗi máy chủ" });
    }
  }
}

export default new ReviewController();
