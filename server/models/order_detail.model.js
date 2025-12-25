import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../config/connect.js";

const OrderDetail = sequelize.define("OrderDetail", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },

  order_id: { type: DataTypes.BIGINT, allowNull: false },

  product_id: { type: DataTypes.BIGINT, allowNull: true },

  product_size_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },

  quantity: { type: DataTypes.INTEGER, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },

  created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
}, {
  tableName: "order_details",
  timestamps: false,
});

export default OrderDetail;
