import { redisClient } from "../config/redis.js";
import { CACHE_TTL, generateCacheKey, generateCachePattern } from "../config/cache.config.js";

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

  async set(key, value, ttl = CACHE_TTL.MEDIUM) {
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

  async deleteNamespace(namespace) {
    try {
      const pattern = generateCachePattern(namespace);
      return await this.deletePattern(pattern);
    } catch (error) {
      console.error("Redis deleteNamespace error:", error.message);
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

  // Legacy method - kept for backward compatibility
  generateKey(prefix, params) {
    return generateCacheKey(prefix, 'data', params);
  },

  // New hierarchical key generation
  generateCacheKey,

  generateCachePattern,

  async getOrSet(key, fetchFn, ttl = CACHE_TTL.MEDIUM) {
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

  async getCacheInfo() {
    try {
      const keys = await redisClient.keys(`${generateCachePattern('*')}`);
      const namespaces = {};
      
      keys.forEach(key => {
        const parts = key.split(':');
        if (parts.length >= 2) {
          const ns = parts[1];
          namespaces[ns] = (namespaces[ns] || 0) + 1;
        }
      });
      
      return {
        totalKeys: keys.length,
        namespaces
      };
    } catch (error) {
      console.error("Redis getCacheInfo error:", error.message);
      return { totalKeys: 0, namespaces: {} };
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

  CACHE_TTL
};

export default RedisService;
