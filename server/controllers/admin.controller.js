import {
  registerAdminService,
  loginAdminService,
  refreshTokenService,
  getAdminProfileService,
} from "../services/admin.service.js";

export const registerAdmin = async (req, res) => {
  try {
    const admin = await registerAdminService(req.body);
    res.status(201).json({
      status: "success",
      data: admin,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const { admin, token, refreshToken } = await loginAdminService(
      username,
      password
    );

    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.cookie("adminRefreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      status: "success",
      data: admin,
    });
  } catch (error) {
    res.status(401).json({
      status: "error",
      message: error.message,
    });
  }
};


export const logoutAdmin = async (req, res) => {
  res.cookie("adminToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.cookie("adminRefreshToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};


export const refreshAdminToken = async (req, res) => {
  try {
    const oldRefreshToken = req.cookies.adminRefreshToken;
    if (!oldRefreshToken) {
      throw new Error("Refresh token not found");
    }

    const { token, refreshToken: newRefreshToken } =
      await refreshTokenService(oldRefreshToken);

    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.cookie("adminRefreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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

export const getAdminProfile = async (req, res) => {
  try {
    const admin = await getAdminProfileService(req.admin.id);
    res.status(200).json({
      status: "success",
      data: admin,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

export const getAdminById = async (req, res) => {
  try {
    const adminId = req.params.id;
    const admin = await getAdminProfileService(adminId);
    res.status(200).json({
      status: "success",
      data: admin,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
};
