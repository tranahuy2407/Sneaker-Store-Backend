import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../config/connect.js";
import { User } from "./index.js";

const UserAddress = sequelize.define("UserAddress", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
      user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
  receiver_name: { type: DataTypes.STRING(255), allowNull: false },
  receiver_phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        is: /^(0|\+84)[0-9]{9,10}$/, 
      },
    },
  address_line: { type: DataTypes.STRING(255), allowNull: false }, 
  ward: { type: DataTypes.STRING(255), allowNull: false },
  district: { type: DataTypes.STRING(255), allowNull: false },
  city: { type: DataTypes.STRING(255), allowNull: false },
  country: { type: DataTypes.STRING(255), allowNull: false, defaultValue: "Vietnam" },
  note: { type: DataTypes.STRING(500), allowNull: true },
  is_default: { type: DataTypes.BOOLEAN, defaultValue: false },

  created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
}, {
  tableName: "user_addresses",
  timestamps: false,
});

export default UserAddress;