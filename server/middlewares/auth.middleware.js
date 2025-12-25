import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";

const JWT_SECRET = process.env.JWT_SECRET
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET

export const admin = async (req, res, next) => {
  try {
    const token = req.cookies.adminToken;

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Access denied. No token provided.",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await Admin.findByPk(decoded.id);

    if (!admin) {
      return res.status(401).json({
        status: "error",
        message: "Invalid token.",
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({
      status: "error",
      message: "Invalid token.",
    });
  }
};

export const generateTokens = (admin) => {
  const token = jwt.sign(
    { id: admin.id, username: admin.username, role: admin.role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  const refreshToken = jwt.sign({ id: admin.id }, JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });

  return { token, refreshToken };
};

export const verifyRefreshToken = (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    return decoded;
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};
