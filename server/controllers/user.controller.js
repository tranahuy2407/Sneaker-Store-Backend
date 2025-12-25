import { UserAddress } from "../models/index.js";
import {
  registerUserService,
  loginUserService,
  refreshUserTokenService,
  getUserProfileService,
  adminGetAllUsersService,
  adminGetUserByIdService,
  adminDeleteUserService,
  adminUserStatsService,
  adminUpdateUserService,
  updateUserProfileService, 
  addUserAddressService 
} from "../services/user.service.js";

// REGISTER
export const registerUser = async (req, res) => {
  try {
    const user = await registerUserService(req.body);
    res.status(201).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token, refreshToken } = await loginUserService(
      email,
      password
    );

    res.cookie("userToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 60 * 60 * 1000,
    });

    res.cookie("userRefreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    res.status(401).json({
      status: "error",
      message: error.message,
    });
  }
};

// LOGOUT
export const logoutUser = async (req, res) => {
  res.cookie("userToken", "", { expires: new Date(0), httpOnly: true });
  res.cookie("userRefreshToken", "", { expires: new Date(0), httpOnly: true });

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};

// REFRESH TOKEN
export const refreshUserToken = async (req, res) => {
  try {
    const oldRefreshToken = req.cookies.userRefreshToken;

    if (!oldRefreshToken) throw new Error("Refresh token not found");

    const { token, refreshToken: newRefreshToken } =
      await refreshUserTokenService(oldRefreshToken);

    res.cookie("userToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 60 * 60 * 1000,
    });

    res.cookie("userRefreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: "success",
      message: "Token refreshed successfully",
    });
  } catch (error) {
    res.status(401).json({
      status: "error",
      message: error.message,
    });
  }
};

// GET PROFILE
export const getUserProfile = async (req, res) => {
  try {
    const user = await getUserProfileService(req.user.id);
    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};
// GET ALL USERS
export const adminGetAllUsers = async (req, res) => {
  try {
    const users = await adminGetAllUsersService();
    res.status(200).json({ status: "success", data: users });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

// GET USER BY ID
export const adminGetUserById = async (req, res) => {
  try {
    const user = await adminGetUserByIdService(req.params.id);
    res.status(200).json({ status: "success", data: user });
  } catch (error) {
    res.status(404).json({ status: "error", message: error.message });
  }
};

// UPDATE FULL USER (admin)
export const adminUpdateUser = async (req, res) => {
  try {
    const user = await adminUpdateUserService(req.params.id, req.body);

    res.status(200).json({
      status: "success",
      data: user,
      message: "User updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// DELETE USER
export const adminDeleteUser = async (req, res) => {
  try {
    const result = await adminDeleteUserService(req.params.id);
    res.status(200).json({ status: "success", message: result.message });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

// USER STATISTICS (FOR DASHBOARD)
export const adminUserStats = async (req, res) => {
  try {
    const stats = await adminUserStatsService();
    res.status(200).json({ status: "success", data: stats });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Update profile + edit addresses
export const updateUserProfile = async (req, res) => {
  try {
    const updatedUser = await updateUserProfileService(req.user.id, req.body);
    res.status(200).json({
      status: "success",
      data: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

// Add new address 
export const addUserAddress = async (req, res) => {
  try {
    const newAddress = await addUserAddressService(req.user.id, req.body);
    res.status(201).json({
      status: "success",
      data: newAddress,
      message: "Address added successfully",
    });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};