import { getChannel } from "./rabbit.js";
import {
  Order,
  ProductSize,
  Invoice,
  sequelize,
  Notification,
  User,
} from "../models/index.js";
import {
  emitOrderStatus,
  emitNewOrderToAdmin,
} from "../helpers/socket.js";
import { Op } from "sequelize";
import { sendEmailTask } from "./email.producer.js";

const QUEUE = "order_created";

export const startOrderConsumer = async () => {
  const channel = getChannel();
  await channel.assertQueue(QUEUE, { durable: true });

  channel.consume(QUEUE, async (msg) => {
    if (!msg) return;

    const data = JSON.parse(msg.content.toString());
    const t = await sequelize.transaction();

    try {
      // 1. Create Invoice
      await Invoice.create(
        {
          order_id: data.orderId,
          total_amount: data.totalAmount,
          issued_at: new Date(),
        },
        { transaction: t }
      );

      await t.commit();

      // 2. Notification ADMIN
      const adminNoti = await Notification.create({
        title: "Đơn hàng mới",
        message: `Có đơn hàng mới #${data.orderCode}`,
        type: "order_created",
        entity_type: "order",
        entity_id: data.orderId,
        receiver_type: "admin",
        receiver_id: null,
      });

      emitNewOrderToAdmin({
        id: adminNoti.id,
        orderId: data.orderId,
        orderCode: data.orderCode,
      });

      // 3. Notification USER (nếu có tài khoản)
      if (data.userId) {
        await Notification.create({
          title: "Đặt hàng thành công",
          message: `Đơn hàng #${data.orderCode} đã được tạo thành công`,
          type: "order_created",
          entity_type: "order",
          entity_id: data.orderId,
          receiver_type: "user",
          receiver_id: data.userId,
        });
      }

      // 4. Send EMAIL (Cho cả Guest và User)
      const targetEmail = data.email;
      if (targetEmail) {
        await sendEmailTask({
          type: "ORDER_CONFIRMATION",
          to: targetEmail,
          payload: {
            orderId: data.orderId,
            orderCode: data.orderCode,
            totalAmount: data.totalAmount,
            items: data.items,
            customerName: data.receiverName || "Khách hàng",
          },
        });
      }

      emitOrderStatus(data.orderId, "Pending");
      channel.ack(msg);
    } catch (err) {
      if (t) await t.rollback();
      console.error("Rabbit consumer error:", err);
      channel.ack(msg);
    }
  });
};
