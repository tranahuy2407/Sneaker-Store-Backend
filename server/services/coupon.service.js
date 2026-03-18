import Coupon from "../models/coupon.model.js";
import Product from "../models/product.model.js";
import CouponProduct from "../models/coupon_product.model.js";
import Promotion from "../models/promotion.model.js";
import { Op, literal } from "sequelize";

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

  // Tìm coupon theo code
  async getByCode(code) {
    const coupon = await Coupon.findOne({ where: { code } });
    if (!coupon) throw new Error("COUPON_NOT_FOUND");
    return coupon;
  }
  async applyDiscount(code, orderTotal, productIds = []) {
    if (!code || typeof code !== "string") {
      throw new Error("COUPON_CODE_REQUIRED");
    }

    if (!orderTotal || isNaN(orderTotal) || orderTotal <= 0) {
      throw new Error("ORDER_TOTAL_INVALID");
    }

    const coupon = await this.getByCode(code.trim().toUpperCase());

    // 1. Kiểm tra trạng thái active
    if (!coupon.is_active) {
      throw new Error("COUPON_INACTIVE");
    }

    // 2. Kiểm tra thời hạn
    const now = new Date();
    if (coupon.start_date && now < new Date(coupon.start_date)) {
      throw new Error("COUPON_NOT_STARTED");
    }
    if (coupon.end_date && now > new Date(coupon.end_date)) {
      throw new Error("COUPON_EXPIRED");
    }

    // 3. Kiểm tra giới hạn sử dụng
    if (
      coupon.usage_limit !== null &&
      coupon.used_count >= coupon.usage_limit
    ) {
      throw new Error("COUPON_USAGE_LIMIT_REACHED");
    }

    // 4. Kiểm tra giá trị đơn hàng tối thiểu
    if (orderTotal < coupon.min_order_value) {
      throw new Error(
        `ORDER_TOTAL_TOO_LOW:${coupon.min_order_value}`
      );
    }

    // 5. Kiểm tra ràng buộc promotion: nếu sản phẩm trong giỏ thuộc
    //    một promotion có coupon, coupon đang dùng phải thuộc promotion đó
    if (productIds && productIds.length > 0) {
      // Tìm các promotion mà:
      //   - có chứa ít nhất 1 product trong giỏ (qua promotion_product)
      //   - có ít nhất 1 coupon (qua coupons)
      const promotionRows = await Promotion.findAll({
        attributes: ["id"],
        include: [
          {
            model: Product,
            as: "products",
            attributes: [],
            where: { id: productIds },
            through: { attributes: [] },
            required: true,
          },
          {
            model: Coupon,
            as: "coupons",
            attributes: [],
            required: true,
          },
        ],
      });

      if (promotionRows.length > 0) {
        // Sản phẩm thuộc ít nhất một promotion có coupon
        // → coupon đang dùng phải thuộc một trong các promotion đó
        const validPromotionIds = promotionRows.map((p) => Number(p.id));
        const couponPromotionId = coupon.promotion_id
          ? Number(coupon.promotion_id)
          : null;

        if (
          couponPromotionId === null ||
          !validPromotionIds.includes(couponPromotionId)
        ) {
          throw new Error("COUPON_NOT_MATCH_PROMOTION");
        }
      }
    }

    // 6. Kiểm tra coupon có giới hạn theo sản phẩm không
    const linkedProducts = await CouponProduct.findAll({
      where: { coupon_id: coupon.id },
    });

    if (linkedProducts.length > 0) {
      // Coupon chỉ áp dụng cho danh sách sản phẩm cụ thể
      if (!productIds || productIds.length === 0) {
        throw new Error("COUPON_PRODUCT_REQUIRED");
      }

      const linkedProductIds = linkedProducts.map((lp) =>
        Number(lp.product_id)
      );
      const hasMatchingProduct = productIds.some((pid) =>
        linkedProductIds.includes(Number(pid))
      );

      if (!hasMatchingProduct) {
        throw new Error("COUPON_NOT_APPLICABLE_TO_PRODUCTS");
      }
    }

    // 6. Tính số tiền giảm giá
    let discountAmount = 0;

    if (coupon.type === "PERCENT") {
      discountAmount = (orderTotal * coupon.value) / 100;
      // Áp dụng giới hạn giảm tối đa nếu có
      if (coupon.max_discount !== null && discountAmount > coupon.max_discount) {
        discountAmount = coupon.max_discount;
      }
    } else if (coupon.type === "FIXED") {
      discountAmount = coupon.value;
      // Không được giảm nhiều hơn tổng đơn hàng
      if (discountAmount > orderTotal) {
        discountAmount = orderTotal;
      }
    }

    discountAmount = Math.round(discountAmount * 100) / 100;
    const finalTotal = Math.max(0, orderTotal - discountAmount);

    return {
      coupon: {
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        max_discount: coupon.max_discount,
      },
      orderTotal,
      discountAmount,
      finalTotal,
    };
  }
}

export default new CouponService();
