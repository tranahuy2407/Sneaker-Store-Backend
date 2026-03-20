import { getChannel } from "./rabbit.js";
import { 
  sendForgotPasswordEmail, 
  sendOrderConfirmationEmail, 
  sendOrderCancelEmail 
} from "../services/mail.service.js";

const QUEUE = "email_queue";

export const startEmailConsumer = async () => {
  const channel = getChannel();
  if (!channel) {
    console.error("RabbitMQ channel not ready for Email Consumer");
    return;
  }

  await channel.assertQueue(QUEUE, { durable: true });

  channel.consume(QUEUE, async (msg) => {
    if (!msg) return;

    const data = JSON.parse(msg.content.toString());
    const { type, to, payload } = data;

    try {

      switch (type) {
        case "FORGOT_PASSWORD":
          await sendForgotPasswordEmail(to, payload.resetUrl);
          break;
        case "ORDER_CONFIRMATION":
          await sendOrderConfirmationEmail(to, payload);
          break;
        case "ORDER_CANCELLED":
          await sendOrderCancelEmail(to, payload);
          break;
        default:
          console.warn("Unknown email type:", type);
      }

      channel.ack(msg);
    } catch (error) {
      console.error(`[Email Queue] Error sending ${type}:`, error);
      channel.nack(msg, false, false); 
    }
  });
};
