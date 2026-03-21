import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../config/connect.js";

const StoreInfo = sequelize.define(
  "StoreInfo",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    address: { type: DataTypes.STRING(255), allowNull: true },
    phone: { type: DataTypes.STRING(20), allowNull: true },
    email: { type: DataTypes.STRING(150), allowNull: true },
    map_url: { type: DataTypes.TEXT, allowNull: true },
    working_hours: { type: DataTypes.STRING(255), allowNull: true },
    facebook_url: { type: DataTypes.STRING(255), allowNull: true },
    instagram_url: { type: DataTypes.STRING(255), allowNull: true },
    logo_url: { type: DataTypes.STRING(255), allowNull: true },
  },
  {
    tableName: "store_info",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default StoreInfo;
