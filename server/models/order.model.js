import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../config/connect.js";

const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },

  user_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },

  payment_method_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },

  receiver_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  receiver_phone: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    set(value) {
      this.setDataValue("email", value.trim().toLowerCase());
    },
    validate: {
      isEmail: {
        msg: "Email không đúng định dạng !",
      },
    },
  },
  address_line: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  ward: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  district: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  note: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },

  total_amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },

  status: {
    type: DataTypes.ENUM("Pending", "Processing", "Completed", "Cancelled"),
    allowNull: false,
    defaultValue: "Pending",
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
  tableName: "orders",
  timestamps: false,
});

export default Order;
