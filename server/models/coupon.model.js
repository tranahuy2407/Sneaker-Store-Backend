import { DataTypes } from "sequelize";
import { sequelize } from "../config/connect.js";

const Coupon = sequelize.define(
  "Coupon",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },

    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },

    type: {
      type: DataTypes.ENUM("PERCENT", "FIXED"),
      allowNull: false,
    },

    value: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    max_discount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

    min_order_value: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },

    usage_limit: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    used_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    start_date: { type: DataTypes.DATE },
    end_date: { type: DataTypes.DATE },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    promotion_id: {
      type: DataTypes.BIGINT,
      allowNull: true, 
    },
  },
  {
    tableName: "coupons",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Coupon;
