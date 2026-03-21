import { DataTypes } from "sequelize";
import { sequelize } from "../config/connect.js";

const HomeSectionProduct = sequelize.define(
  "HomeSectionProduct",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    home_section_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: { model: "home_sections", key: "id" },
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
    tableName: "home_section_product",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["home_section_id", "product_id"],
      },
    ],
  }
);

export default HomeSectionProduct;