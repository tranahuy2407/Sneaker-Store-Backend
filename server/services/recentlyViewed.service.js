import { RecentlyViewed, Product, ProductImage, Brand, sequelize } from "../models/index.js";
import { Sequelize } from "sequelize";

class RecentlyViewedService {
  /**
   * Add or update a product view
   */
  async addView(userId, productId) {
    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      throw new Error("PRODUCT_NOT_FOUND");
    }

    // Upsert view
    const [view, created] = await RecentlyViewed.findOrCreate({
      where: { user_id: userId, product_id: productId },
      defaults: { viewed_at: new Date() },
    });

    if (!created) {
      view.viewed_at = new Date();
      await view.save();
    }

    return view;
  }

  /**
   * Get recently viewed products for a user
   */
  async getRecentlyViewed(userId, query) {
    const { limit = 10 } = query;

    const views = await RecentlyViewed.findAll({
      where: { user_id: userId },
      limit: +limit,
      order: [["viewed_at", "DESC"]],
      include: [
        {
          model: Product,
          as: "product",
          include: [
            {
              model: ProductImage,
              as: "images",
              limit: 1,
            },
            {
              model: Brand,
              as: "brand",
              attributes: ["id", "name"],
            },
          ],
        },
      ],
    });

    return views;
  }
}

export default new RecentlyViewedService();
