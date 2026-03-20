import bcrypt from "bcrypt";
import { Order, User, UserAddress } from "../models/index.js";

import {
  generateUserTokens,
  verifyUserRefreshToken,
} from "../middlewares/user.middleware.js";
import { Op } from "sequelize";
import crypto from "crypto";
import { sendForgotPasswordEmail } from "./mail.service.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// REGISTER USER
export const registerUserService = async (userData) => {
  try {
    const existingUser = await User.findOne({
      where: { username: userData.username },
    });

    if (existingUser) {
      throw new Error("Username already exists");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await User.create({
      ...userData,
      password: hashedPassword,
    });

    const { password, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  } catch (error) {
    throw error;
  }
};

// LOGIN USER
export const loginUserService = async (email, password) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error("Invalid email or password");

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new Error("Invalid email or password");

    const tokens = generateUserTokens(user);
    const { password: _, ...userWithoutPassword } = user.toJSON();

    return {
      user: userWithoutPassword,
      ...tokens,
    };
  } catch (error) {
    throw error;
  }
};

// REFRESH TOKEN USER
export const refreshUserTokenService = async (refreshToken) => {
  try {
    const decoded = verifyUserRefreshToken(refreshToken);
    const user = await User.findByPk(decoded.id);

    if (!user) throw new Error("User not found");

    return generateUserTokens(user);
  } catch (error) {
    throw error;
  }
};

// GET USER PROFILE
export const getUserProfileService = async (userId) => {
  try {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: UserAddress,
          as: "addresses",
          attributes: [
            "id",
            "receiver_name",
            "receiver_phone",
            "address_line",
            "ward",
            "district",
            "city",
            "country",
            "note",
            "is_default",
          ],
        },
      ],
    });

    if (!user) throw new Error("User not found");

    return user;
  } catch (error) {
    throw error;
  }
};
// Get all (admin)
export const adminGetAllUsersService = async () => {
  try {
    const users = await User.findAll({
      order: [["created_at", "DESC"]],
      attributes: { exclude: ["password"] },
    });
    return users;
  } catch (error) {
    throw error;
  }
};

// get by id (admin)
export const adminGetUserByIdService = async (id) => {
  try {
    const user = await User.findByPk(id, {
      attributes: { 
        exclude: ["password"] 
      },
      include: [
        {
          model: UserAddress,
          as: "addresses",
        },
        {
          model: Order,
          as: "orders",
        }
      ],
    });
    if (!user) throw new Error("User not found");
    return user;
  } catch (error) {
    throw error;
  }
};

// UPDATE FULL USER 
export const adminUpdateUserService = async (id, updateData) => {
  try {
    const user = await User.findByPk(id);
    if (!user) throw new Error("User not found");

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    await user.update(updateData);

    const { password, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  } catch (error) {
    throw error;
  }
};


//delete user
export const adminDeleteUserService = async (id) => {
  try {
    const user = await User.findByPk(id);
    if (!user) throw new Error("User not found");

    await user.destroy();
    return { message: "User deleted successfully" };
  } catch (error) {
    throw error;
  }
};

// customer stats
export const adminUserStatsService = async () => {
  try {
    const totalUsers = await User.count();
    const activeUsers = await User.count({ where: { is_active: true } });
    const bannedUsers = await User.count({ where: { is_active: false } });

    return {
      totalUsers,
      activeUsers,
      bannedUsers,
    };
  } catch (error) {
    throw error;
  }
};
//UPDATE PROFILE
export const updateUserProfileService = async (userId, updateData) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) throw new Error("User not found");

    const {
      addresses,
      status,
      role,
      password,
      ...safeUserData
    } = updateData;

    if (password) {
      safeUserData.password = await bcrypt.hash(password, 10);
    }
    await user.update(safeUserData);
    if (addresses && Array.isArray(addresses)) {
      for (const addr of addresses) {
        if (!addr.id) continue; 

        const { is_default, ...addressData } = addr;
        await UserAddress.update(addressData, {
          where: {
            id: addr.id,
            user_id: userId,
          },
        });
        if (is_default === true) {
          await UserAddress.update(
            { is_default: false },
            {
              where: {
                user_id: userId,
                id: { [Op.ne]: addr.id },
              },
            }
          );
          await UserAddress.update(
            { is_default: true },
            {
              where: {
                id: addr.id,
                user_id: userId,
              },
            }
          );
        }
      }
    }

    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: UserAddress,
          as: "addresses",
          attributes: [
            "id",
            "receiver_name",
            "receiver_phone",
            "address_line",
            "ward",
            "district",
            "city",
            "country",
            "note",
            "is_default",
          ],
        },
      ],
    });

    return updatedUser;
  } catch (error) {
    throw error;
  }
};
// ADD USER ADDRESS
export const addUserAddressService = async (userId, addressData) => {
  try {
    if (addressData.is_default) {
      const existingDefault = await UserAddress.findOne({
        where: { user_id: userId, is_default: true },
      });

      if (existingDefault) {
        await UserAddress.update(
          { is_default: false },
          { where: { user_id: userId } }
        );
      }
    }

    const newAddress = await UserAddress.create({
      ...addressData,
      user_id: userId,
    });

    return newAddress;
  } catch (error) {
    throw error;
  }
};

// FORGOT PASSWORD
export const forgotPasswordService = async (email) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error("Email không tồn tại trong hệ thống!");

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    await user.update({
      reset_password_token: resetToken,
      reset_password_expires: resetExpires,
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await sendForgotPasswordEmail(user.email, resetUrl);

    return { message: "Email khôi phục mật khẩu đã được gửi!" };
  } catch (error) {
    throw error;
  }
};

// RESET PASSWORD
export const resetPasswordService = async (token, newPassword) => {
  try {
    const user = await User.findOne({
      where: {
        reset_password_token: token,
        reset_password_expires: { [Op.gt]: new Date() },
      },
    });

    if (!user) throw new Error("Mã khôi phục không hợp lệ hoặc đã hết hạn!");

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await user.update({
      password: hashedPassword,
      reset_password_token: null,
      reset_password_expires: null,
    });

    return { message: "Mật khẩu đã được cập nhật thành công!" };
  } catch (error) {
    throw error;
  }
};

// GOOGLE LOGIN
export const googleLoginService = async (idToken) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await User.findOne({ where: { email } });

    if (!user) {
      const randomPassword = crypto.randomBytes(16).toString("hex");
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      
      user = await User.create({
        username: email.split("@")[0] + "_" + Math.floor(Math.random() * 1000),
        email,
        password: hashedPassword,
        status: "Active",
      });
    }

    const tokens = generateUserTokens(user);
    const { password: _, ...userWithoutPassword } = user.toJSON();

    return {
      user: userWithoutPassword,
      ...tokens,
    };
  } catch (error) {
    console.error("Google login service error:", error);
    throw new Error("Xác thực Google thất bại!");
  }
};