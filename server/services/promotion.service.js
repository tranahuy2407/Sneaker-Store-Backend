import Promotion from "../models/promotion.model.js";
import Coupon from "../models/coupon.model.js";
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
    ],
  });
};

/**
 * Tạo promotion
 */
export const createPromotionService = async (promotionData, imageFile) => {
  if (imageFile) {
    promotionData.image = await uploadToCloudinary(imageFile, "Promotions");
  }
  return await Promotion.create(promotionData);
};

/**
 * Cập nhật promotion
 */
export const updatePromotionService = async (id, promotionData, imageFile) => {
  const promotion = await Promotion.findByPk(id);
  if (!promotion) throw new Error("Promotion not found");

  if (imageFile) {
    if (promotion.image) {
      await deleteFromCloudinary(promotion.image);
    }
    promotionData.image = await uploadToCloudinary(imageFile, "Promotions");
  }

  await promotion.update(promotionData);
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
 * Gán coupon vào promotion (CHUẨN BUSINESS)
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
