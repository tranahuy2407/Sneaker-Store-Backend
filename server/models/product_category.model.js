import { DataTypes } from "sequelize";
import { sequelize } from "../config/connect.js";
import Product from "./product.model.js";
import Category from "./category.model.js";

const ProductCategory = sequelize.define(
  "ProductCategory",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: { model: "products", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    category_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: { model: "categories", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "product_category",
    timestamps: false,
  }
);

export default ProductCategory;
