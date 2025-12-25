import Promotion from "../models/promotion.model.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "./cloudinary.service.js";

export const getAllPromotionsService = async () => {
  try {
    const promotions = await Promotion.findAll({
      order: [["created_at", "DESC"]],
    });
    return promotions;
  } catch (error) {
    throw new Error(error);
  }
};

export const getPromotionByIdService = async (id) => {
  try {
    const promotion = await Promotion.findByPk(id);
    return promotion;
  } catch (error) {
    throw new Error(error);
  }
};

export const createPromotionService = async (promotionData, imageFile) => {
  try {
    if (imageFile) {
      const imageUrl = await uploadToCloudinary(imageFile, "Promotions");
      promotionData.image = imageUrl;
    }
    const promotion = await Promotion.create(promotionData);
    return promotion;
  } catch (error) {
    throw new Error(error);
  }
};

export const updatePromotionService = async (id, promotionData, imageFile) => {
  try {
    const promotion = await Promotion.findByPk(id);
    if (!promotion) {
      throw new Error("Promotion not found");
    }

    if (imageFile) {
      if (promotion.image) {
        await deleteFromCloudinary(promotion.image);
      }
      const imageUrl = await uploadToCloudinary(imageFile, "Promotions");
      promotionData.image = imageUrl;
    }

    await promotion.update(promotionData);
    return promotion;
  } catch (error) {
    throw new Error(error);
  }
};

export const deletePromotionService = async (id) => {
  try {
    const promotion = await Promotion.findByPk(id);
    if (!promotion) {
      throw new Error("Promotion not found");
    }

    if (promotion.image) {
      await deleteFromCloudinary(promotion.image);
    }

    await promotion.destroy();
    return true;
  } catch (error) {
    throw new Error(error);
  }
};
