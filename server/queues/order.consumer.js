import { getChannel } from "./rabbit.js";
import {
  Order,
  ProductSize,
  Invoice,
  sequelize,
  Notification,
} from "../models/index.js";
import {
  emitOrderStatus,
  emitNewOrderToAdmin,
} from "../helpers/socket.js";
import { Op } from "sequelize";

const QUEUE = "order_created";

export const startOrderConsumer = async () => {
  const channel = getChannel();
  await channel.assertQueue(QUEUE, { durable: true });

  channel.consume(QUEUE, async (msg) => {
    if (!msg) return;

    const data = JSON.parse(msg.content.toString());
    const t = await sequelize.transaction();

    try {
      // 1. Trừ kho
      for (const item of data.items) {
        const [affected] = await ProductSize.update(
          { stock: sequelize.literal(`stock - ${item.quantity}`) },
          {
            where: {
              id: item.product_size_id,
              stock: { [Op.gte]: item.quantity },
            },
            transaction: t,
          }
        );

        if (affected === 0) {
          throw new Error("OUT_OF_STOCK");
        }
      }

      // 2. Create Invoice
      await Invoice.create(
        {
          order_id: data.orderId,
          total_amount: data.totalAmount,
          issued_at: new Date(),
        },
        { transaction: t }
      );

      await t.commit();

      // 3. Notification ADMIN
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

      // 4. Notification USER
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

      emitOrderStatus(data.orderId, "Pending");
      channel.ack(msg);
    } catch (err) {
      await t.rollback();

      if (err.message === "OUT_OF_STOCK") {
        await Order.update(
          { status: "Cancelled" },
          { where: { id: data.orderId } }
        );

        emitOrderStatus(data.orderId, "Cancelled");
        channel.ack(msg);
        return;
      }

      console.error("Rabbit error:", err);
      channel.ack(msg);
    }
  });
};
