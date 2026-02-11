import Coupon from "../models/coupon.model.js";
import Product from "../models/product.model.js";
import { Op } from "sequelize";

class CouponService {
  async create(data) {
    return await Coupon.create(data);
  }

  async getAll(query) {
    const {
      keyword,
      is_active,
      promotion_id,
      page = 1,
      limit = 10,
    } = query;

    const where = {};

    if (keyword) {
      where.code = { [Op.like]: `%${keyword}%` };
    }

    if (is_active !== undefined) {
      where.is_active = is_active;
    }

    if (promotion_id) {
      where.promotion_id = promotion_id;
    }

    const offset = (page - 1) * limit;

    const { rows, count } = await Coupon.findAndCountAll({
      where,
      limit: +limit,
      offset,
      order: [["created_at", "DESC"]],
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

  async getById(id) {
    const coupon = await Coupon.findByPk(id);
    if (!coupon) throw new Error("COUPON_NOT_FOUND");
    return coupon;
  }

  async update(id, data) {
    const coupon = await this.getById(id);
    await coupon.update(data);
    return coupon;
  }

  async delete(id) {
    const coupon = await this.getById(id);
    await coupon.destroy();
    return true;
  }

  async toggleActive(id) {
    const coupon = await this.getById(id);
    coupon.is_active = !coupon.is_active;
    await coupon.save();
    return coupon;
  }
  
  async addProducts(couponId, productIds = []) {
    const coupon = await this.getById(couponId);

    if (!Array.isArray(productIds) || productIds.length === 0) {
      throw new Error("PRODUCT_IDS_REQUIRED");
    }

    const products = await Product.findAll({
      where: { id: productIds },
    });

    if (products.length === 0) {
      throw new Error("PRODUCT_NOT_FOUND");
    }
    await coupon.addProducts(products);

    return true;
  }

  //ghi đè toàn bộ product
  async syncProducts(couponId, productIds = []) {
    const coupon = await this.getById(couponId);
    await coupon.setProducts(productIds);
    return true;
  }

  // xoá product khỏi coupon
  async removeProducts(couponId, productIds = []) {
    const coupon = await this.getById(couponId);
    await coupon.removeProducts(productIds);
    return true;
  }
}

export default new CouponService();
