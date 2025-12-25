import amqp from "amqplib";

let channel;

export const connectRabbitMQ = async () => {
  const conn = await amqp.connect(process.env.RABBITMQ_URL);
  channel = await conn.createChannel();
};

export const getChannel = () => channel;
