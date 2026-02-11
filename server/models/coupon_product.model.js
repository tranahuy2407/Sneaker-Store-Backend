import { DataTypes } from "sequelize";
import { sequelize } from "../config/connect.js";

const CouponProduct = sequelize.define(
  "CouponProduct",
  {
    coupon_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  {
    tableName: "coupon_product",
    timestamps: false,
  }
);

export default CouponProduct;
