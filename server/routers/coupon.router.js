import express from "express";
import CouponController from "../controllers/coupon.controller.js";
import { admin } from "../middlewares/auth.middleware.js";

const couponRouter = express.Router();

// Public
couponRouter.get("/api/v1/coupons", CouponController.getAll);
couponRouter.get("/api/v1/coupons/:id", CouponController.getDetail);

// Áp dụng mã giảm giá (user gọi khi checkout)
couponRouter.post(
  "/api/v1/coupons/apply-discount",
  CouponController.applyDiscount
);

// Admin
couponRouter.post("/api/v1/coupons", admin, CouponController.create);
couponRouter.put("/api/v1/coupons/:id", admin, CouponController.update);
couponRouter.delete("/api/v1/coupons/:id", admin, CouponController.delete);
couponRouter.put(
  "/api/v1/coupons/:id/toggle-active",
  admin,
  CouponController.toggleActive
);

couponRouter.post(
  "/api/v1/coupons/:id/products",
  admin,
  CouponController.addProducts
);

export default couponRouter;
