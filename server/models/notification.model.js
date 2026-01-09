import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../config/connect.js";

const Notification = sequelize.define(
  "Notification",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    entity_type: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    entity_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },

    receiver_type: {
      type: DataTypes.ENUM("admin", "user"),
      allowNull: false,
    },

    receiver_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },

    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },

    updated_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    tableName: "notifications",
    timestamps: false,
  }
);

export default Notification;
