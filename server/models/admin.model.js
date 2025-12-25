import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../config/connect.js";

const Admin = sequelize.define("Admin", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING(255), allowNull: false },
  password: { type: DataTypes.STRING(255), allowNull: false },
  role: { type: DataTypes.STRING(255), defaultValue: "Admin" },
  created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
}, {
  tableName: "admins",
  timestamps: false,
});

export default Admin;
