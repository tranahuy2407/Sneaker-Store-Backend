import express from "express";
import ReviewController from "../controllers/review.controller.js";
import { user } from "../middlewares/user.middleware.js";
import { admin } from "../middlewares/auth.middleware.js";

const reviewRouter = express.Router();

// Public routes
reviewRouter.get(
  "/api/v1/reviews/product/:productId",
  ReviewController.getReviewsByProduct
);

// User routes
reviewRouter.post(
  "/api/v1/reviews",
  user, 
  ReviewController.addReview
);

// Admin routes
reviewRouter.get(
  "/api/v1/reviews",
  admin, 
  ReviewController.getAllReviews
);

reviewRouter.delete(
  "/api/v1/reviews/:id",
  admin,
  ReviewController.deleteReview
);

export default reviewRouter;
