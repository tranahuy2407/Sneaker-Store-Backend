import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../config/connect.js";

const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },

    username: { type: DataTypes.STRING(255), allowNull: false },

    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true, 
        len: [5, 255],
      },
    },

    password: { type: DataTypes.STRING(255), allowNull: false },
    status: {
          type: DataTypes.ENUM("Active", "Inactive"),
          allowNull: false,
          defaultValue: "Active",
        },
        created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

export default User;
