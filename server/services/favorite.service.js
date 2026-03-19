import { Favorite, Product, ProductImage, Brand } from "../models/index.js";

class FavoriteService {
  async toggleFavorite(userId, productId) {
    const existingFavorite = await Favorite.findOne({
      where: {
        user_id: userId,
        product_id: productId,
      },
    });

    if (existingFavorite) {
      await existingFavorite.destroy();
      return { status: "removed" };
    } else {
      const product = await Product.findByPk(productId);
      if (!product) {
        throw new Error("PRODUCT_NOT_FOUND");
      }

      const favorite = await Favorite.create({
        user_id: userId,
        product_id: productId,
      });
      return { status: "added", data: favorite };
    }
  }

  async getFavorites(userId, query) {
    const { page = 1, limit = 10 } = query;
    const offset = (page - 1) * limit;

    const { rows, count } = await Favorite.findAndCountAll({
      where: { user_id: userId },
      limit: +limit,
      offset: +offset,
      order: [["created_at", "DESC"]],
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

    return {
      data: rows,
      pagination: {
        total: count,
        page: +page,
        limit: +limit,
      },
    };
  }

  async checkIsFavorited(userId, productId) {
    const favorite = await Favorite.findOne({
      where: {
        user_id: userId,
        product_id: productId,
      },
    });
    return !!favorite;
  }
}

export default new FavoriteService();
