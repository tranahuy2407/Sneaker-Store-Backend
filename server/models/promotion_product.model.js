import { DataTypes } from "sequelize";
import { sequelize } from "../config/connect.js";

const PromotionProduct = sequelize.define(
  "PromotionProduct",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    promotion_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: { model: "promotions", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: { model: "products", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "promotion_product",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["promotion_id", "product_id"],
      },
    ],
  }
);

export default PromotionProduct;
