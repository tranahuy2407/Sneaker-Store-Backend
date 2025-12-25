import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../config/connect.js";

const Product = sequelize.define(
  "Product",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    slug: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    price: { type: DataTypes.FLOAT, allowNull: false }, 
    discountPrice: { type: DataTypes.FLOAT },
    description: { type: DataTypes.TEXT },
    status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      allowNull: false,
      defaultValue: "Active",
    },
    brand_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: { model: "brands", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "products",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [{ unique: true, fields: ["slug"] }],
    hooks: {
      beforeCreate: (product) => {
        if (!product.discountPrice) {
          product.discountPrice = product.price;
        }
      },
      beforeUpdate: (product) => {
        if (!product.discountPrice) {
          product.discountPrice = product.price;
        }
      },
    },
  }
);

export default Product;
