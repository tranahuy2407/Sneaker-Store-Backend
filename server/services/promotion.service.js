import { Promotion, Coupon, Product, ProductImage } from "../models/index.js";
import { Op } from "sequelize";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "./cloudinary.service.js";

/**
 * Lấy tất cả promotion + coupons
 */
export const getAllPromotionsService = async () => {
  return await Promotion.findAll({
    include: [
      {
        model: Coupon,
        as: "coupons",
      },
      {
        model: Product,
        as: "products",
        include: [{ model: ProductImage, as: "images", limit: 1 }],
      },
    ],
    order: [["created_at", "DESC"]],
  });
};

/**
 * Lấy tất cả promotion đang hoạt động (dành cho Client/UI)
 */
export const getActivePromotionsService = async () => {
  const now = new Date();
  return await Promotion.findAll({
    where: {
      is_active: true,
      [Op.and]: [
        {
          [Op.or]: [{ start_date: { [Op.lte]: now } }, { start_date: null }],
        },
        {
          [Op.or]: [{ end_date: { [Op.gte]: now } }, { end_date: null }],
        },
      ],
    },
    include: [
      {
        model: Coupon,
        as: "coupons",
      },
      {
        model: Product,
        as: "products",
        include: [{ model: ProductImage, as: "images", limit: 1 }],
      },
    ],
    order: [["created_at", "DESC"]],
  });
};

/**
 * Lấy promotion theo ID
 */
export const getPromotionByIdService = async (id) => {
  return await Promotion.findByPk(id, {
    include: [
      {
        model: Coupon,
        as: "coupons",
      },
      {
        model: Product,
        as: "products",
        include: [{ model: ProductImage, as: "images", limit: 1 }],
      },
    ],
  });
};

/**
 * Tạo promotion
 */
export const createPromotionService = async (promotionData, imageFile) => {
  if (imageFile) {
    promotionData.image = imageFile.path;
  }
  return await Promotion.create(promotionData);
};

/**
 * Cập nhật promotion
 */
export const updatePromotionService = async (id, promotionData, imageFile) => {
  const promotion = await Promotion.findByPk(id);
  if (!promotion) throw new Error("Promotion not found");
  const { products, coupons, createdAt, updatedAt, ...updateData } = promotionData;

  if (imageFile) {
    if (promotion.image) {
      await deleteFromCloudinary(promotion.image);
    }
    updateData.image = imageFile.path;
  }

  await promotion.update(updateData);
  return promotion;
};

/**
 * Xóa promotion
 */
export const deletePromotionService = async (id) => {
  const promotion = await Promotion.findByPk(id);
  if (!promotion) throw new Error("Promotion not found");

  if (promotion.image) {
    await deleteFromCloudinary(promotion.image);
  }

  await promotion.destroy();
};

/**
 * Gán coupon vào promotion 
 */
export const addCouponsToPromotionService = async (
  promotionId,
  couponIds = []
) => {
  const promotion = await Promotion.findByPk(promotionId);
  if (!promotion) throw new Error("Promotion not found");

  await Coupon.update(
    { promotion_id: promotionId },
    {
      where: {
        id: couponIds,
      },
    }
  );

  return true;
};

/**
 * Gán sản phẩm vào promotion
 */
export const addProductsToPromotionService = async (
  promotionId,
  productIds = []
) => {
  const promotion = await Promotion.findByPk(promotionId);
  if (!promotion) throw new Error("Promotion not found");

  const products = await Product.findAll({
    where: { id: productIds },
  });

  if (products.length !== productIds.length) {
    throw new Error("One or more products not found");
  }

  await promotion.setProducts(productIds);

  return true;
};

/**
 * Gỡ bỏ sản phẩm khỏi promotion
 */
export const removeProductsFromPromotionService = async (
  promotionId,
  productIds = []
) => {
  const promotion = await Promotion.findByPk(promotionId);
  if (!promotion) throw new Error("Promotion not found");

  // Gỡ sản phẩm
  await promotion.removeProducts(productIds);

  return true;
};
