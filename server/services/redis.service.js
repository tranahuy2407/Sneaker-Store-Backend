import { redisClient } from "../config/redis.js";

const DEFAULT_TTL = 3600; // 1 hour

export const RedisService = {
  async get(key) {
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Redis get error:", error.message);
      return null;
    }
  },

  async set(key, value, ttl = DEFAULT_TTL) {
    try {
      const data = JSON.stringify(value);
      await redisClient.setex(key, ttl, data);
      return true;
    } catch (error) {
      console.error("Redis set error:", error.message);
      return false;
    }
  },

  async delete(key) {
    try {
      await redisClient.del(key);
      return true;
    } catch (error) {
      console.error("Redis delete error:", error.message);
      return false;
    }
  },

  async deletePattern(pattern) {
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(...keys);
      }
      return true;
    } catch (error) {
      console.error("Redis deletePattern error:", error.message);
      return false;
    }
  },

  async exists(key) {
    try {
      const result = await redisClient.exists(key);
      return result === 1;
    } catch (error) {
      console.error("Redis exists error:", error.message);
      return false;
    }
  },

  generateKey(prefix, params) {
    const sortedParams = Object.keys(params)
      .sort()
      .map((key) => `${key}:${params[key]}`)
      .join(":");
    return `${prefix}:${sortedParams}`;
  },

  async getOrSet(key, fetchFn, ttl = DEFAULT_TTL) {
    try {
      const cached = await this.get(key);
      if (cached) {
        return cached;
      }

      const data = await fetchFn();
      if (data) {
        await this.set(key, data, ttl);
      }
      return data;
    } catch (error) {
      console.error("Redis getOrSet error:", error.message);
      return await fetchFn();
    }
  },

  async flushAll() {
    try {
      await redisClient.flushall();
      console.log("Redis cache cleared");
      return true;
    } catch (error) {
      console.error("Redis flushAll error:", error.message);
      return false;
    }
  },
};

export default RedisService;
