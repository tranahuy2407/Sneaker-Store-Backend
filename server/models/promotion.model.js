import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../config/connect.js";

const Promotion = sequelize.define(
  "Promotion",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    image: { type: DataTypes.STRING(500), allowNull: true },
    discount: { type: DataTypes.FLOAT, defaultValue: 0 },
    startDate: { type: DataTypes.DATE },
    endDate: { type: DataTypes.DATE },
    status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      defaultValue: "Active",
    },
    created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  },
  {
    tableName: "promotions",
    timestamps: false,
  }
);

export default Promotion;
