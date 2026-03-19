import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../config/connect.js";

const RecentlyViewed = sequelize.define(
  "RecentlyViewed",
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
    viewed_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    tableName: "recently_viewed",
    timestamps: false, 
    indexes: [
      {
        unique: true,
        fields: ["user_id", "product_id"],
      },
      {
        fields: ["user_id", "viewed_at"],
      },
    ],
  }
);

export default RecentlyViewed;
