import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../config/connect.js";

const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  order_code: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true,
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
    validate: {
      is: {
        args: /^(0|\+84)[3|5|7|8|9][0-9]{8}$/,
        msg: "Số điện thoại không hợp lệ (định dạng chuẩn Việt Nam)",
      },
    },
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    set(value) {
      this.setDataValue("email", value.trim().toLowerCase());
    },
    validate: {
      isEmail: {
        msg: "Email không đúng định dạng!",
      },
      notEmpty: {
        msg: "Email không được để trống",
      },
      len: {
        args: [5, 255],
        msg: "Độ dài email từ 5 đến 255 ký tự",
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

  payment_status: {
    type: DataTypes.ENUM("Unpaid", "Paid", "Refunded"),
    allowNull: false,
    defaultValue: "Unpaid",
  },

  transaction_id: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },

  zp_trans_id: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },

  m_refund_id: {
    type: DataTypes.STRING(255),
    allowNull: true,
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
