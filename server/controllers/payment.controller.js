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
        console.error("[ZaloPay] Callback MAC verification failed!");
        result.return_code = -1;
        result.return_message = "mac not equal";
      } else {
        const dataJson = JSON.parse(dataStr);
        const app_trans_id = dataJson["app_trans_id"];
        const zp_trans_id = dataJson["zp_trans_id"];

        await this.handlePaymentSuccess(app_trans_id, zp_trans_id);

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
         await this.handlePaymentSuccess(app_trans_id, result.zp_trans_id);
      } else if (result.return_code === 3) {
        // ZaloPay thông báo lỗi giao dịch hoặc đã bị huỷ
        const order = await Order.findOne({ where: { transaction_id: app_trans_id } });
        if (order && order.status === "Pending") {
          const { OrderService } = await import("../services/order.service.js");
          await OrderService.cancelOrder({
            orderId: order.id,
            reason: "Thanh toán giao dịch ZaloPay không thành công hoặc bị huỷ.",
            user: { id: order.user_id }
          });
          console.log(`[ZaloPay] Order ${order.id} automatically cancelled due to payment failure.`);
        }
      }

      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  /**
   * Hàm xử lý chung khi thanh toán thành công
   */
  async handlePaymentSuccess(app_trans_id, zp_trans_id) {
    const { OrderDetail, Notification } = await import("../models/index.js");
    const order = await Order.findOne({ 
      where: { transaction_id: app_trans_id },
      include: [{ model: OrderDetail, as: "details" }] 
    });

    if (!order) {
      console.warn(`[ZaloPay] Order not found for trans_id: ${app_trans_id}`);
      return;
    }

    if (order.payment_status === "Paid") {
      return; // Đã xử lý rồi
    }

    console.log("[ZaloPay] Handling payment success for order:", order.id);
    
    // Xoá giỏ hàng sau khi thanh toán thành công
    if (order.user_id) {
      const { default: cartService } = await import("../services/cart.service.js");
      await cartService.clearCart(order.user_id);
    }
    await order.update({ 
      payment_status: "Paid",
      status: "Processing",
      zp_trans_id: zp_trans_id?.toString(),
      note: "Đơn hàng đã được thanh toán qua ZaloPay."
    });

    // 1. Kích hoạt quy trình xử lý đơn hàng (Invoice, Email, Admin Noti) عبر Queue
    const itemsForQueue = order.details.map(d => ({
      product_id: d.product_id,
      product_size_id: d.product_size_id,
      quantity: d.quantity,
      price: d.price,
      name: d.name || "Sản phẩm"
    }));

    try {
      const { publishOrderCreated } = await import("../queues/order.producer.js");
      await publishOrderCreated({
        orderId: order.id,
        orderCode: order.order_code,
        userId: order.user_id,
        email: order.email,
        receiverName: order.receiver_name,
        items: itemsForQueue,
        totalAmount: order.total_amount,
      });
    } catch (queueErr) {
      console.error("[ZaloPay] Failed to publish order_created event:", queueErr.message);
    }

    // 2. Thêm thông báo cho người dùng
    if (order.user_id) {
      try {
        await Notification.create({
          title: "Thanh toán thành công",
          message: `Đơn hàng #${order.order_code} đã được thanh toán thành công qua ZaloPay.`,
          type: "payment_success",
          entity_type: "order",
          entity_id: order.id,
          receiver_type: "user",
          receiver_id: order.user_id,
        });
      } catch (notifErr) {
        console.error("[ZaloPay] Failed to create notification:", notifErr.message);
      }
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
