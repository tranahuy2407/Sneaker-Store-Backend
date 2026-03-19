import express from "express";
import FavoriteController from "../controllers/favorite.controller.js";
import { user } from "../middlewares/user.middleware.js";

const favoriteRouter = express.Router();

// User routes (Required authentication)
favoriteRouter.post(
  "/api/v1/favorites",
  user,
  FavoriteController.toggleFavorite
);

favoriteRouter.get(
  "/api/v1/favorites",
  user,
  FavoriteController.getFavorites
);

favoriteRouter.get(
  "/api/v1/favorites/check/:productId",
  user,
  FavoriteController.checkIsFavorited
);

export default favoriteRouter;
