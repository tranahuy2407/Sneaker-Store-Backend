import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../config/connect.js";

const ProductImage = sequelize.define(
  "ProductImage",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    product_id: { type: DataTypes.BIGINT, allowNull: false },
    url: { type: DataTypes.STRING(500), allowNull: false },
    isDefault: { type: DataTypes.BOOLEAN, defaultValue: false },
    allText: { type: DataTypes.TEXT },
  },
  {
    tableName: "product_images",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default ProductImage;
