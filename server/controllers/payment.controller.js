import { ZaloPayService } from "../services/zalopay.service.js";
import { Order, sequelize } from "../models/index.js";
import crypto from "crypto";

export const PaymentController = {
  /**
   * API tạo đơn hàng ZaloPay
   */
  async createZaloPayOrder(req, res) {
    try {
      const { orderId, amount, customerName, items } = req.body;
      
      if (!orderId || !amount) {
        return res.status(400).json({ message: "Thiếu thông tin đơn hàng hoặc số tiền" });
      }

      const result = await ZaloPayService.createPayment({
        orderId,
        amount,
        customerName,
        items
      });

      if (result.return_code === 1) {
        await Order.update(
          { transaction_id: result.app_trans_id },
          { where: { id: orderId } }
        );
        return res.status(200).json(result);
      } else {
        return res.status(400).json({
          message: result.return_message || "Tạo đơn hàng ZaloPay thất bại",
          result
        });
      }
    } catch (err) {
      console.error("CREATE ZALOPAY ORDER ERROR:", err);
      res.status(500).json({ message: err.message });
    }
  },

  /**
   * Webhook callback từ ZaloPay
   */
  async zalopayCallback(req, res) {
    let result = {};
    try {
      const { data: dataStr, mac: reqMac } = req.body;
      
      const isValid = ZaloPayService.verifyCallback(dataStr, reqMac);

      if (!isValid) {
        result.return_code = -1;
        result.return_message = "mac not equal";
      } else {
        const dataJson = JSON.parse(dataStr);
        const app_trans_id = dataJson["app_trans_id"];
        const zp_trans_id = dataJson["zp_trans_id"];

        // Cập nhật trạng thái đơn hàng trong database
        const order = await Order.findOne({ where: { transaction_id: app_trans_id } });
        if (order) {
          await order.update({ 
            payment_status: "Paid",
            status: "Processing",
            zp_trans_id: zp_trans_id?.toString(),
            note: "Đơn hàng đã được thanh toán qua ZaloPay."
          });
          console.log(`[ZaloPay] Callback success for order: ${order.id}, ZP Trans ID: ${zp_trans_id}`);
        }

        result.return_code = 1;
        result.return_message = "success";
      }
    } catch (ex) {
      console.error("ZaloPay Callback error:", ex);
      result.return_code = 0;
      result.return_message = ex.message;
    }
    res.json(result);
  },

  /**
   * Truy vấn trạng thái đơn hàng từ server
   */
  async queryStatus(req, res) {
    try {
      const { app_trans_id } = req.params;
      const result = await ZaloPayService.checkStatus(app_trans_id);
      
      if (result.return_code === 1) {
         const order = await Order.findOne({ where: { transaction_id: app_trans_id } });
         if (order && order.payment_status !== "Paid") {
            await order.update({ 
              payment_status: "Paid", 
              status: "Processing",
              zp_trans_id: result.zp_trans_id?.toString()
            });
         }
      }

      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  /**
   * Truy vấn trạng thái hoàn tiền ZaloPay
   */
  async queryRefundStatus(req, res) {
    try {
      const { m_refund_id } = req.params;
      if (!m_refund_id) {
        return res.status(400).json({ message: "Thiếu mã hoàn tiền m_refund_id" });
      }
      const result = await ZaloPayService.checkRefundStatus(m_refund_id);
      res.status(200).json(result);
    } catch (err) {
      console.error("QUERY REFUND STATUS ERROR:", err);
      res.status(500).json({ message: err.message });
    }
  }
};
