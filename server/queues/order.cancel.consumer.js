import { getChannel } from "./rabbit.js";
import {
  sequelize,
  Order,
  OrderDetail,
  ProductSize,
  Notification,
  User,
} from "../models/index.js";
import {
  emitOrderStatus,
  emitNewOrderToAdmin,
} from "../helpers/socket.js";
import { sendEmailTask } from "./email.producer.js";

const QUEUE = "order_cancelled";

export const startOrderCancelConsumer = async () => {
  const channel = getChannel();
  await channel.assertQueue(QUEUE, { durable: true });

  channel.consume(QUEUE, async (msg) => {
    if (!msg) return;

    const data = JSON.parse(msg.content.toString());
    const t = await sequelize.transaction();

    try {
      const order = await Order.findByPk(data.orderId, { transaction: t });
      if (!order) throw new Error("ORDER_NOT_FOUND");

      /* ================= HOÀN KHO ================= */
      const details = await OrderDetail.findAll({
        where: { order_id: data.orderId },
        transaction: t,
      });

      for (const item of details) {
        await ProductSize.increment(
          { stock: item.quantity },
          {
            where: { id: item.product_size_id },
            transaction: t,
          }
        );
      }

      /* ================= UPDATE ORDER ================= */
      await order.update(
        {
          status: "Cancelled",
          note: `[HUỶ ĐƠN] ${data.reason}`,
        },
        { transaction: t }
      );

      await t.commit();

      const adminNoti = await Notification.create({
        title: "Đơn hàng bị huỷ",
        message: `Đơn hàng #${order.order_code} đã bị huỷ`,
        type: "order_cancelled",
        entity_type: "order",
        entity_id: order.id,
        receiver_type: "admin",
        receiver_id: null,
      });

      emitOrderStatus(order.id, "Cancelled");

      emitNewOrderToAdmin({
        id: adminNoti.id,
        type: "order_cancelled",
        orderId: order.id,
        orderCode: order.order_code,
        reason: data.reason,
      });

      // Email Notification
      const user = await User.findByPk(order.user_id);
      if (user && user.email) {
        await sendEmailTask({
          type: "ORDER_CANCELLED",
          to: user.email,
          payload: {
            orderId: order.id,
            orderCode: order.order_code,
            reason: data.reason,
            customerName: user.username,
          },
        });
      }

      channel.ack(msg);
    } catch (err) {
      await t.rollback();
      console.error("Cancel order consumer error:", err);

      channel.nack(msg, false, true);
    }
  });
};
