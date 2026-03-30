import express from "express";
import { ShippingCostController } from "../controllers/shippingCost.controller.js";
import { admin } from "../middlewares/auth.middleware.js";

const shippingCostRouter = express.Router();

// Public routes
shippingCostRouter.get(
  "/api/v1/shipping-costs",
  ShippingCostController.getAll
);

shippingCostRouter.get(
  "/api/v1/shipping-costs/:id",
  ShippingCostController.getById
);

shippingCostRouter.get(
  "/api/v1/shipping-costs/lookup/by-name",
  ShippingCostController.getCostByName
);

// Protected routes (Admin)
shippingCostRouter.post(
  "/api/v1/shipping-costs",
  admin,
  ShippingCostController.create
);

shippingCostRouter.put(
  "/api/v1/shipping-costs/:id",
  admin,
  ShippingCostController.update
);

shippingCostRouter.delete(
  "/api/v1/shipping-costs/:id",
  admin,
  ShippingCostController.delete
);

export default shippingCostRouter;
