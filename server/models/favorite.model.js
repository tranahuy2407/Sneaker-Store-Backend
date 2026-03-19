import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../config/connect.js";

const Favorite = sequelize.define(
  "Favorite",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: { model: "users", key: "id" },
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
    tableName: "favorites",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        unique: true,
        fields: ["user_id", "product_id"],
      },
    ],
  }
);

export default Favorite;
