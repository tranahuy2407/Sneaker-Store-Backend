import axios from "axios";
import crypto from "crypto";
import moment from "moment";
import dotenv from "dotenv";

dotenv.config();

const config = {
  app_id: process.env.ZALOPAY_APP_ID ,
  key1: process.env.ZALOPAY_KEY1 ,
  key2: process.env.ZALOPAY_KEY2 ,
  endpoint: process.env.ZALOPAY_ENDPOINT ,
  callback_url: process.env.ZALOPAY_CALLBACK_URL,
};

export const ZaloPayService = {
  /**
   * Tạo đơn hàng thanh toán ZaloPay
   */
  async createPayment({ orderId, amount, customerName, items = [] }) {
    const embed_data = JSON.stringify({
       redirecturl: `${process.env.FRONTEND_URL}/payment-return?orderId=${orderId}`,
    });
    
    const items_str = JSON.stringify(items);
    const transID = Math.floor(Math.random() * 1000000);
    const app_trans_id = `${moment().format("YYMMDD")}_${transID}`;
    
    const order = {
      app_id: config.app_id,
      app_trans_id: app_trans_id,
      app_user: customerName || "User",
      app_time: Date.now(),
      item: items_str,
      embed_data: embed_data,
      amount: amount,
      description: `Thanh toán đơn hàng #${orderId}`,
      bank_code: "",
      callback_url: config.callback_url,
    };

    // appid|app_trans_id|app_user|amount|apptime|embeddata|item
    const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
    order.mac = crypto.createHmac("sha256", config.key1).update(data).digest("hex");

    try {
      const res = await axios.post(config.endpoint, null, { params: order });
      return {
        ...res.data,
        app_trans_id
      };
    } catch (err) {
      console.error("ZaloPay Create Order Error:", err.response?.data || err.message);
      throw new Error("Không thể kết nối với cổng thanh toán ZaloPay");
    }
  },

  /**
   * Truy vấn trạng thái đơn hàng
   */
  async checkStatus(app_trans_id) {
    const postData = {
      app_id: config.app_id,
      app_trans_id: app_trans_id,
    };

    const data = postData.app_id + "|" + postData.app_trans_id + "|" + config.key1;
    postData.mac = crypto.createHmac("sha256", config.key1).update(data).digest("hex");

    try {
      const res = await axios.post("https://sb-openapi.zalopay.vn/v2/query", null, { params: postData });
      return res.data;
    } catch (err) {
      console.error("ZaloPay Query Error:", err.message);
      throw err;
    }
  },

  /**
   * Xử lý callback từ ZaloPay
   */
  verifyCallback(dataStr, reqMac) {
    const mac = crypto.createHmac("sha256", config.key2).update(dataStr).digest("hex");
    return mac === reqMac;
  },

  /**
   * Hoàn tiền giao dịch
   */
  async refund({ zp_trans_id, amount, description }) {
    const timestamp = Date.now();
    const m_refund_id = `${moment().format("YYMMDD")}_${config.app_id}_${timestamp}`;
    
    const params = {
      app_id: config.app_id,
      m_refund_id,
      zp_trans_id,
      amount,
      timestamp,
      description,
    };

    // app_id|zp_trans_id|amount|description|timestamp
    const data = params.app_id + "|" + params.zp_trans_id + "|" + params.amount + "|" + params.description + "|" + params.timestamp;
    params.mac = crypto.createHmac("sha256", config.key1).update(data).digest("hex");

    try {
      const res = await axios.post("https://sb-openapi.zalopay.vn/v2/refund", null, { params });
      return { ...res.data, m_refund_id };
    } catch (err) {
      console.error("ZaloPay Refund Error:", err.message);
      throw err;
    }
  },

  /**
   * Truy vấn trạng thái hoàn tiền
   */
  async checkRefundStatus(m_refund_id) {
    const timestamp = Date.now();
    const params = {
      app_id: config.app_id,
      m_refund_id,
      timestamp,
    };

    const data = config.app_id + "|" + m_refund_id + "|" + timestamp;
    params.mac = crypto.createHmac("sha256", config.key1).update(data).digest("hex");

    try {
      const res = await axios.post("https://sb-openapi.zalopay.vn/v2/query_refund", null, { params });
      return res.data;
    } catch (err) {
      console.error("ZaloPay Query Refund Error:", err.message);
      throw err;
    }
  }
};
