import {
  getAllPromotionsService,
  getPromotionByIdService,
  createPromotionService,
  updatePromotionService,
  deletePromotionService,
  addCouponsToPromotionService,
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

/**
 * GET promotion by id
 */
export const getPromotionById = async (req, res) => {
  try {
    const promotion = await getPromotionByIdService(req.params.id);

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

/**
 * CREATE promotion
 */
export const createPromotion = async (req, res) => {
  try {
    const promotion = await createPromotionService(req.body, req.file);
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

/**
 * UPDATE promotion
 */
export const updatePromotion = async (req, res) => {
  try {
    const promotion = await updatePromotionService(
      req.params.id,
      req.body,
      req.file
    );

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

/**
 * DELETE promotion
 */
export const deletePromotion = async (req, res) => {
  try {
    await deletePromotionService(req.params.id);
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

/**
 * ADD coupons to promotion
 */
export const addCouponsToPromotion = async (req, res) => {
  try {
    const { couponIds } = req.body;

    await addCouponsToPromotionService(req.params.id, couponIds);

    res.status(200).json({
      status: "success",
      message: "Coupons added to promotion successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
