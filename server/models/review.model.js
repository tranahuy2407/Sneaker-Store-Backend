import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../config/connect.js";

const Review = sequelize.define("Review", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  content: { type: DataTypes.TEXT, allowNull: false },
  rating: { type: DataTypes.INTEGER, defaultValue: 5 },
  created_at: { type: DataTypes.DATE, allowNull: true, defaultValue: Sequelize.NOW },
  updated_at: { type: DataTypes.DATE, allowNull: true, defaultValue: Sequelize.NOW },
}, {
  tableName: "reviews",
  timestamps: false,
});

export default Review;
