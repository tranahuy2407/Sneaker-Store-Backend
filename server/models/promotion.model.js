import { DataTypes } from "sequelize";
import { sequelize } from "../config/connect.js";

const Promotion = sequelize.define(
  "Promotion",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    image: { type: DataTypes.STRING(500) },

    description: { type: DataTypes.TEXT },

    start_date: { type: DataTypes.DATE },
    end_date: { type: DataTypes.DATE },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

  },
  {
    tableName: "promotions",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Promotion;
