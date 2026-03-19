import { Review, Order, OrderDetail, ProductSize, User, Product } from "../models/index.js";
import { Op } from "sequelize";

class ReviewService {
  /**
   * Tạo đánh giá mới (dành cho người dùng)
   */
  async addReview(userId, productId, rating, content) {
    if (!rating || rating < 1 || rating > 5) {
      throw new Error("RATING_INVALID");
    }
    if (!content || content.trim() === "") {
      throw new Error("CONTENT_REQUIRED");
    }

    // Kiểm tra xem user có đơn hàng nào đã hoàn thành chứa sản phẩm này không
    const orderDetail = await OrderDetail.findOne({
      include: [
        {
          model: Order,
          as: "order",
          required: true,
          where: {
            user_id: userId,
            status: "Completed",
          },
        },
        {
          model: ProductSize,
          as: "productSize",
          required: true,
          where: { product_id: productId },
        },
      ],
    });

    if (!orderDetail) {
      throw new Error("NOT_PURCHASED");
    }

    // Kiểm tra xem user đã review sản phẩm này chưa
    const existingReview = await Review.findOne({
      where: {
        user_id: userId,
        product_id: productId,
      },
    });

    if (existingReview) {
      throw new Error("ALREADY_REVIEWED");
    }

    // Tạo đánh giá
    const review = await Review.create({
      user_id: userId,
      product_id: productId,
      rating,
      content: content.trim(),
    });

    return review;
  }

  /**
   * Lấy tất cả review theo sản phẩm (dành cho Public/User)
   */
  async getReviewsByProduct(productId, query) {
    const { page = 1, limit = 10 } = query;
    const offset = (page - 1) * limit;

    const { rows, count } = await Review.findAndCountAll({
      where: { product_id: productId },
      limit: +limit,
      offset: +offset,
      order: [["created_at", "DESC"]],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username"], 
        },
      ],
    });

    // Tính sao trung bình
    let averageRating = 0;
    if (count > 0) {
      const sum = rows.reduce((acc, curr) => acc + curr.rating, 0);
      averageRating = (sum / count).toFixed(1);
    }

    return {
      data: rows,
      pagination: {
        total: count,
        page: +page,
        limit: +limit,
      },
      averageRating: Number(averageRating),
      totalReviews: count,
    };
  }

  /**
   * Lấy tất cả đánh giá của hệ thống (dành cho Admin)
   */
  async getAllReviews(query) {
    const { page = 1, limit = 10, product_id, rating } = query;
    const offset = (page - 1) * limit;

    const where = {};
    if (product_id) where.product_id = product_id;
    if (rating) where.rating = rating;

    const { rows, count } = await Review.findAndCountAll({
      where,
      limit: +limit,
      offset: +offset,
      order: [["created_at", "DESC"]],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "email"], 
        },
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "slug", "price"],
        },
      ],
    });

    return {
      data: rows,
      pagination: {
        total: count, 
        page: +page,
        limit: +limit,
      },
    };
  }

  /**
   * Xóa review (dành cho Admin)
   */
  async deleteReview(id) {
    const review = await Review.findByPk(id);
    if (!review) throw new Error("REVIEW_NOT_FOUND");

    await review.destroy();
    return true;
  }
}

export default new ReviewService();
