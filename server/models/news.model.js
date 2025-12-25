import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../config/connect.js";

const News = sequelize.define("News", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(255), allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  status: { type: DataTypes.ENUM("Active", "Inactive"), defaultValue: "Active" },
  created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
}, {
  tableName: "news",
  timestamps: false,
});

export default News;
