import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../config/connect.js";

const ShippingCost = sequelize.define("ShippingCost", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(255), allowNull: false },
  cost: { type: DataTypes.FLOAT, defaultValue: 0 },
  created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
}, {
  tableName: "shippingcosts",
  timestamps: false,
});

export default ShippingCost;
