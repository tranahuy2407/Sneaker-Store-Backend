  import express from "express";
  import {
    registerUser,
    loginUser,
    logoutUser,
    refreshUserToken, 
    getUserProfile,
    adminGetAllUsers,
    adminGetUserById,
    adminDeleteUser,
    adminUserStats,
    adminUpdateUser,
    updateUserProfile,
    addUserAddress,
    forgotPassword,
    resetPassword,
    googleLogin
  } from "../controllers/user.controller.js";
  import {
    getLoyaltyStatus,
    claimLoyaltyGift
  } from "../controllers/loyalty.controller.js";
  import { user } from "../middlewares/user.middleware.js";
  import { admin } from "../middlewares/auth.middleware.js";

  const userRouter = express.Router();

  // Public routes
  userRouter.post("/api/v1/user/register", registerUser);
  userRouter.post("/api/v1/user/login", loginUser);
  userRouter.post("/api/v1/user/refresh-token", refreshUserToken);
  userRouter.post("/api/v1/user/google-login", googleLogin);

  // Password Reset
  userRouter.post("/api/v1/user/forgot-password", forgotPassword);
  userRouter.post("/api/v1/user/reset-password", resetPassword);

  // Protected routes
  userRouter.post("/api/v1/user/logout", user, logoutUser);
  userRouter.get("/api/v1/user/profile", user, getUserProfile);

  userRouter.get("/api/v1/admin/users", admin, adminGetAllUsers);
  userRouter.get("/api/v1/admin/users/:id", admin, adminGetUserById);

  userRouter.put("/api/v1/admin/users/:id", admin, adminUpdateUser);

  userRouter.delete("/api/v1/admin/users/:id", admin, adminDeleteUser);

  userRouter.get("/api/v1/admin/users/stats", admin, adminUserStats);
  userRouter.put("/api/v1/user/profile", user, updateUserProfile);
  userRouter.post("/api/v1/user/address", user, addUserAddress);

  // Loyalty routes
  userRouter.get("/api/v1/user/loyalty/status", user, getLoyaltyStatus);
  userRouter.post("/api/v1/user/loyalty/claim", user, claimLoyaltyGift);

  export default userRouter;