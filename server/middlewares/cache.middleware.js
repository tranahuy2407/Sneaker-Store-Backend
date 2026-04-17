import { RedisService } from "../services/redis.service.js";

const DEFAULT_TTL = 300; // 5 minutes

export const cacheMiddleware = (prefix, ttl = DEFAULT_TTL) => {
  return async (req, res, next) => {
    try {
      const cacheKey = RedisService.generateKey(prefix, {
        ...req.params,
        ...req.query,
        userId: req.user?.id || "guest",
      });

      const cachedData = await RedisService.get(cacheKey);

      if (cachedData) {
        return res.status(200).json(cachedData);
      }

      res.sendResponse = res.json;
      res.json = (body) => {
        if (body && (body.status === "success" || body.status === 200)) {
          RedisService.set(cacheKey, body, ttl).catch((err) => {
            console.error("Cache set error:", err.message);
          });
        }
        res.sendResponse(body);
      };

      next();
    } catch (error) {
      console.error("Cache middleware error:", error.message);
      next();
    }
  };
};

export const clearCache = (pattern) => {
  return async (req, res, next) => {
    try {
      await RedisService.deletePattern(pattern);
      next();
    } catch (error) {
      console.error("Clear cache error:", error.message);
      next();
    }
  };
};

export default cacheMiddleware;
