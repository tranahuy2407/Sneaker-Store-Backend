import express from "express";
import cartController from "../controllers/cart.controller.js"; 
import { user } from "../middlewares/user.middleware.js"; 

const cartRouter = express.Router();

cartRouter.get("/api/v1/cart", user, cartController.getCart);
cartRouter.post("/api/v1/cart", user, cartController.addToCart);
cartRouter.put("/api/v1/cart", user, cartController.updateCartItem);
cartRouter.delete(
  "/api/v1/cart/:productSizeId",
  user,
  cartController.removeCartItem
);
cartRouter.delete("/api/v1/cart", user, cartController.clearCart);

export default cartRouter;
