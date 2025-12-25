import express from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import { connectDB, sequelize } from "./config/connect.js";
import { connectRabbitMQ } from "./queues/rabbit.js";
import { startOrderConsumer } from "./queues/order.consumer.js";
import { startOrderCancelConsumer } from "./queues/order.cancel.consumer.js";
import { initSocket } from "./helpers/socket.js";

import categoryRouter from "./routers/category.router.js";
import brandRouter from "./routers/brand.router.js";
import adminRouter from "./routers/admin.router.js";
import productRouter from "./routers/product.router.js";
import promotionRouter from "./routers/promotion.router.js";
import warehouseHistoryRouter from "./routers/warehouseHistory.router.js";
import userRouter from "./routers/user.router.js";
import cartRouter from "./routers/cart.router.js";
import paymentRouter from "./routers/paymentMethod.router.js";
import addressRouter from "./routers/address.routes.js";
import orderRouter from "./routers/order.router.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

initSocket(server);

const port = 8080;

(async () => {
  try {
    await connectDB();
    await sequelize.sync({ alter: true });
    await connectRabbitMQ();
    await startOrderConsumer();
    await startOrderCancelConsumer();
    app.use(addressRouter);
    app.use(categoryRouter);
    app.use(brandRouter);
    app.use(paymentRouter);
    app.use(adminRouter);
    app.use(userRouter);
    app.use(productRouter);
    app.use(promotionRouter);
    app.use(warehouseHistoryRouter);
    app.use(cartRouter);
    app.use(orderRouter);  
    server.listen(port, () => {
      console.log(`Server chạy trên port ${port}`);
    });
  } catch (err) {
    console.error("Lỗi khi khởi động server:", err);
    process.exit(1);
  }
})();
