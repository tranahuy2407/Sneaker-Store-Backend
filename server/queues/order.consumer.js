import { getChannel } from "./rabbit.js";
import { Order, ProductSize, Invoice, sequelize } from "../models/index.js";
import { emitOrderStatus } from "../helpers/socket.js";
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
      // 1. Trừ kho (ATOMIC)
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
          totalAmount: data.totalAmount,
          invoiceDate: new Date(),
        },
        { transaction: t }
      );

      // 3. Update order status
      await Order.update(
        { status: "Pending" },
        { where: { id: data.orderId }, transaction: t }
      );

      await t.commit();

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
      channel.nack(msg, false, true);
    }
  });
};
