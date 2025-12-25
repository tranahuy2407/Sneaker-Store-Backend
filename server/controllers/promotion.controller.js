import {
  getAllPromotionsService,
  getPromotionByIdService,
  createPromotionService,
  updatePromotionService,
  deletePromotionService,
} from "../services/promotion.service.js";

export const getAllPromotions = async (req, res) => {
  try {
    const promotions = await getAllPromotionsService();
    res.status(200).json({
      status: "success",
      data: promotions,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const getPromotionById = async (req, res) => {
  try {
    const { id } = req.params;
    const promotion = await getPromotionByIdService(id);
    if (!promotion) {
      return res.status(404).json({
        status: "error",
        message: "Promotion not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: promotion,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const createPromotion = async (req, res) => {
  try {
    const promotionData = req.body;
    // Handle single image from multer
    const file = req.file;
    const promotion = await createPromotionService(promotionData, file);
    res.status(201).json({
      status: "success",
      data: promotion,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const updatePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const promotionData = req.body;
    // Handle single image from multer
    const file = req.file;
    const promotion = await updatePromotionService(id, promotionData, file);
    res.status(200).json({
      status: "success",
      data: promotion,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const deletePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    await deletePromotionService(id);
    res.status(200).json({
      status: "success",
      message: "Promotion deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
