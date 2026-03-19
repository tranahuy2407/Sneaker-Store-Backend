import express from "express";
import RecentlyViewedController from "../controllers/recentlyViewed.controller.js";
import { user } from "../middlewares/user.middleware.js";

const recentlyViewedRouter = express.Router();

recentlyViewedRouter.post(
  "/api/v1/recently-viewed",
  user,
  RecentlyViewedController.addView
);

recentlyViewedRouter.get(
  "/api/v1/recently-viewed",
  user,
  RecentlyViewedController.getRecentlyViewed
);

export default recentlyViewedRouter;
