import express from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import { connectDB, sequelize } from "./config/connect.js";
import { redisClient } from "./config/redis.js";
import { connectRabbitMQ } from "./queues/rabbit.js";
import { startOrderConsumer } from "./queues/order.consumer.js";
import { startOrderCancelConsumer } from "./queues/order.cancel.consumer.js";
import { startEmailConsumer } from "./queues/email.consumer.js";
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
import shippingCostRouter from "./routers/shippingCost.router.js";
import notificationRouter from "./routers/notification.router.js";
import invoiceRouter from "./routers/invoice.router.js";
import couponRouter from "./routers/coupon.router.js";
import reviewRouter from "./routers/review.router.js";
import favoriteRouter from "./routers/favorite.router.js";
import recentlyViewedRouter from "./routers/recentlyViewed.router.js";
import homeSectionRouter from "./routers/home_section.router.js";
import newsRouter from "./routers/news.router.js";
import contactRouter from "./routers/contact.router.js";
import storeInfoRouter from "./routers/store_info.router.js";
import dashboardRouter from "./routers/dashboard.router.js";
import seedRouter from "./routers/seed.router.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
const allowedOrigins = [
  "http://localhost:5173",
  "https://sneaker-store-frontend-three.vercel.app",
  "https://sneaker-store-frontend-three.vercel.app/"
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
  // Also push without trailing slash if it exists
  if (process.env.FRONTEND_URL.endsWith("/")) {
    allowedOrigins.push(process.env.FRONTEND_URL.slice(0, -1));
  }
}

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Allow for now but log error in real production
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

initSocket(server);

const port = process.env.PORT || 8080;

(async () => {
  try {
    await connectDB();
    await sequelize.sync({ alter: true });
    await redisClient.connect().catch(() => {
      console.log("Redis không khả dụng, tiếp tục không caching");
    });
    await connectRabbitMQ();
    await startOrderConsumer();
    await startOrderCancelConsumer();
    await startEmailConsumer();
    app.use(addressRouter);
    app.use(categoryRouter);
    app.use(brandRouter);
    app.use(paymentRouter);
    app.use(shippingCostRouter);
    app.use(notificationRouter);
    app.use(invoiceRouter);
    app.use(couponRouter);
    app.use(reviewRouter);
    app.use(favoriteRouter);
    app.use(recentlyViewedRouter);
    app.use(adminRouter);
    app.use(userRouter);
    app.use(productRouter);
    app.use(promotionRouter);
    app.use(warehouseHistoryRouter);
    app.use(cartRouter);
    app.use(orderRouter);  
    app.use(homeSectionRouter);
    app.use(newsRouter);
    app.use(contactRouter);
    app.use(storeInfoRouter);  
    app.use(dashboardRouter);
    app.use(seedRouter);        // POST /api/seed?secret=...  

    server.listen(port, () => {
      console.log(`Server chạy trên port ${port}`);
    });
  } catch (err) {
    console.error("Lỗi khi khởi động server:", err);
    process.exit(1);
  }
})();
