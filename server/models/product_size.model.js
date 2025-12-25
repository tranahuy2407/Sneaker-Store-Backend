import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../config/connect.js";

const ProductSize = sequelize.define(
  "ProductSize",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },

    product_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: { model: "products", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },

    size: { type: DataTypes.FLOAT, allowNull: false },   
    stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  },
  {
    tableName: "product_sizes",
    timestamps: false,
  }
);

export default ProductSize;
