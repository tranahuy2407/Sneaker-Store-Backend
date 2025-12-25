import { getChannel } from "./rabbit.js";
import { sequelize, Order, OrderDetail, ProductSize } from "../models/index.js";
import { emitOrderStatus } from "../helpers/socket.js";

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

      // Lấy chi tiết đơn
      const details = await OrderDetail.findAll({
        where: { order_id: data.orderId },
        transaction: t,
      });

      // Cộng kho lại
      for (const item of details) {
        await ProductSize.increment(
          { stock: item.quantity },
          {
            where: { id: item.product_size_id },
            transaction: t,
          }
        );
      }

      // Update order
      await Order.update(
        {
          status: "Cancelled",
          note: `[HUỶ ĐƠN] ${data.reason}`,
        },
        { where: { id: data.orderId }, transaction: t }
      );

      await t.commit();

      // Emit realtime
      emitOrderStatus(data.orderId, "Cancelled");

      channel.ack(msg);
    } catch (err) {
      await t.rollback();
      console.error("Cancel order consumer error:", err);

      // retry
      channel.nack(msg, false, true);
    }
  });
};
