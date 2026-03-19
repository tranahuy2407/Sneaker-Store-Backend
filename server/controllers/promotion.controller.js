import {
  getAllPromotionsService,
  getPromotionByIdService,
  createPromotionService,
  updatePromotionService,
  deletePromotionService,
  addCouponsToPromotionService,
  getActivePromotionsService,
  addProductsToPromotionService,
  removeProductsFromPromotionService,
} from "../services/promotion.service.js";

/**
 * Lấy all active promotions (Client)
 */
export const getActivePromotions = async (req, res) => {
  try {
    const promotions = await getActivePromotionsService();
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
    console.log("DEBUG - updatePromotion params:", req.params);
    console.log("DEBUG - updatePromotion body:", req.body);
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

/**
 * Gán danh sách sản phẩm vào promotion
 */
export const addProductsToPromotion = async (req, res) => {
  try {
    const { productIds } = req.body;
    const { id: promotionId } = req.params;

    if (!productIds || !Array.isArray(productIds)) {
      return res.status(400).json({
        status: "error",
        message: "Vui lòng cung cấp danh sách productIds.",
      });
    }

    await addProductsToPromotionService(promotionId, productIds);

    res.status(200).json({
      status: "success",
      message: "Gán sản phẩm vào chương trình khuyến mãi thành công.",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

/**
 * Gỡ sản phẩm khỏi chương trình khuyến mãi
 */
export const removeProductsFromPromotion = async (req, res) => {
  try {
    const { productIds } = req.body;
    const { id: promotionId } = req.params;

    if (!productIds || !Array.isArray(productIds)) {
      return res.status(400).json({
        status: "error",
        message: "Vui lòng cung cấp danh sách productIds cần gỡ.",
      });
    }

    await removeProductsFromPromotionService(promotionId, productIds);

    res.status(200).json({
      status: "success",
      message: "Gỡ sản phẩm khỏi chương trình khuyến mãi thành công.",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
