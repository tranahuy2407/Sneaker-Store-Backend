import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../config/connect.js";

const HomeSection = sequelize.define(
  "HomeSection",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(255), allowNull: false },
    slug: { type: DataTypes.STRING(255), allowNull: true },
    banner_url: { type: DataTypes.STRING(255), allowNull: false },
    section_type: { 
      type: DataTypes.ENUM("brand", "sale", "new_arrival", "banner_only"),
      defaultValue: "brand"
    },
    display_order: { type: DataTypes.INTEGER, defaultValue: 0 },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    tableName: "home_sections",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default HomeSection;
