import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redisClient = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  db: process.env.REDIS_DB || 0,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
});

redisClient.on("connect", () => {
  console.log("Kết nối Redis thành công!");
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err.message);
});

redisClient.on("reconnecting", () => {
  console.log("Đang kết nối lại Redis...");
});

export { redisClient };
export default redisClient;
