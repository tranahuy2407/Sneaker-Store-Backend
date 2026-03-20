import { getChannel } from "./rabbit.js";

const QUEUE = "email_queue";

export const sendEmailTask = async (emailData) => {
  try {
    const channel = getChannel();
    if (!channel) {
      console.warn("RabbitMQ channel not ready, skipping email queue...");
      return;
    }

    await channel.assertQueue(QUEUE, { durable: true });
    channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(emailData)), {
      persistent: true,
    });

  } catch (error) {
    console.error("error push email to queue:", error);
  }
};
