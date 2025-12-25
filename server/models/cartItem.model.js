import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../config/connect.js";

const CartItem = sequelize.define(
  "CartItem",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    cart_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: { model: "carts", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    product_size_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: { model: "product_sizes", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
    quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
  },
  {
    tableName: "cart_items",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default CartItem;
