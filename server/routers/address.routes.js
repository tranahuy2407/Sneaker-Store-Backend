import express from "express";
import AddressController from "../controllers/address.controller.js";

const addressRouter = express.Router();

addressRouter.get("/api/v1/address/provinces", AddressController.getProvinces);
addressRouter.get(
  "/api/v1/address/districts/:provinceId",
  AddressController.getDistricts
);
addressRouter.get(
  "/api/v1/address/wards/:districtId",
  AddressController.getWards
);

export default addressRouter;
