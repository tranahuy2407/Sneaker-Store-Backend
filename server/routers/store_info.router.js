import express from "express";
import { StoreInfoController } from "../controllers/store_info.controller.js";
import { admin } from "../middlewares/auth.middleware.js";
import { uploadStoreLogo } from "../middlewares/upload.middleware.js";

const storeInfoRouter = express.Router();

// Public route: Lấy thông tin cửa hàng
storeInfoRouter.get("/api/v1/store-info", StoreInfoController.get);

// Admin route: Cập nhật thông tin cửa hàng
storeInfoRouter.put("/api/v1/admin/store-info", admin, uploadStoreLogo, StoreInfoController.update);

export default storeInfoRouter;
