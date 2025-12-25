import { getChannel } from "./rabbit.js";

const QUEUE = "order_created";

export const publishOrderCreated = async (data) => {
  const channel = getChannel();
  if (!channel) {
    throw new Error("RabbitMQ channel not initialized !");
  }

  await channel.assertQueue(QUEUE, { durable: true });

  channel.sendToQueue(
    QUEUE,
    Buffer.from(JSON.stringify(data)),
    { persistent: true }
  );
};
