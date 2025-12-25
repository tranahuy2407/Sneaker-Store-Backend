import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../config/connect.js";

const Invoice = sequelize.define("Invoice", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },

  order_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },

  total_amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },

  issued_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },

  created_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
}, {
  tableName: "invoices",
  timestamps: false,
});


export default Invoice;
