import bcrypt from "bcrypt";
import Admin from "../models/admin.model.js";
import {
  generateTokens,
  verifyRefreshToken,
} from "../middlewares/auth.middleware.js";

export const registerAdminService = async (adminData) => {
  try {
    const existingAdmin = await Admin.findOne({
      where: { username: adminData.username },
    });
    if (existingAdmin) {
      throw new Error("Username already exists");
    }

    const hashedPassword = await bcrypt.hash(adminData.password, 10);
    const admin = await Admin.create({
      ...adminData,
      password: hashedPassword,
    });

    const { password, ...adminWithoutPassword } = admin.toJSON();
    return adminWithoutPassword;
  } catch (error) {
    throw error;
  }
};

export const loginAdminService = async (username, password) => {
  try {
    const admin = await Admin.findOne({ where: { username } });
    if (!admin) {
      throw new Error("Invalid username or password");
    }

    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      throw new Error("Invalid username or password");
    }

    const tokens = generateTokens(admin);
    const { password: _, ...adminWithoutPassword } = admin.toJSON();

    return {
      admin: adminWithoutPassword,
      ...tokens,
    };
  } catch (error) {
    throw error;
  }
};

export const refreshTokenService = async (refreshToken) => {
  try {
    const decoded = verifyRefreshToken(refreshToken);
    const admin = await Admin.findByPk(decoded.id);

    if (!admin) {
      throw new Error("Admin not found");
    }

    return generateTokens(admin);
  } catch (error) {
    throw error;
  }
};

export const getAdminProfileService = async (adminId) => {
  try {
    const admin = await Admin.findByPk(adminId);
    if (!admin) {
      throw new Error("Admin not found");
    }

    const { password, ...adminWithoutPassword } = admin.toJSON();
    return adminWithoutPassword;
  } catch (error) {
    throw error;
  }
};


export const getAdminByIdService = async (adminId) => {
  try {
    const admin = await Admin.findByPk(adminId);
    if (!admin) {
      throw new Error("Admin not found");
    }
    const { password, ...adminWithoutPassword } = admin.toJSON();
    return adminWithoutPassword;
  } catch (error) {
    throw error;
  }
};
