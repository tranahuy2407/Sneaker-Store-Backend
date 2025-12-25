import express from "express";
import {
  getAllBrands,
  getBrandBySlug,
  createBrand,
  updateBrand,
  deleteBrand,
  getBrandById,
  getBrandProducts,
} from "../controllers/brand.controller.js";
import { admin } from "../middlewares/auth.middleware.js";
import { uploadBrand } from "../middlewares/upload.middleware.js";

const brandRouter = express.Router();

brandRouter.get("/api/v1/brands", getAllBrands);
brandRouter.get("/api/v1/brands/:slug", getBrandBySlug);
brandRouter.get("/api/v1/brands/id/:id", getBrandById);
brandRouter.get("/api/v1/brands/:id/products", getBrandProducts);
brandRouter.post(
  "/api/v1/brands",
  admin,
  uploadBrand,
  createBrand
);
brandRouter.put(
  "/api/v1/brands/:id",
  admin,
  uploadBrand,
  updateBrand
);
brandRouter.delete("/api/v1/brands/:id", admin, deleteBrand);

export default brandRouter;
