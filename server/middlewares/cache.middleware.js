import { RedisService } from "../services/redis.service.js";
import { CACHE_TTL, generateCacheKey, generateCachePattern, CACHE_NAMESPACES, CACHE_ACTIONS } from "../config/cache.config.js";

export const cacheMiddleware = (namespace, action, ttl = CACHE_TTL.MEDIUM) => {
  return async (req, res, next) => {
    try {
      // Build params from request
      const params = {
        ...(req.params.slug && { slug: req.params.slug }),
        ...(req.params.id && { id: req.params.id }),
        ...(req.query.page && { page: req.query.page }),
        ...(req.query.limit && { limit: req.query.limit }),
        ...(req.query.search && { search: req.query.search }),
        ...(req.query.sort && { sort: req.query.sort }),
        ...(req.query.categoryId && { cat: req.query.categoryId }),
        ...(req.query.brandId && { brand: req.query.brandId }),
        ...(req.query.status && { status: req.query.status }),
        user: req.user?.id || "guest"
      };

      const cacheKey = generateCacheKey(namespace, action, params);
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

// Clear all cache for a namespace (e.g., clearCacheByNamespace(CACHE_NAMESPACES.PRODUCTS))
export const clearCacheByNamespace = (namespace) => {
  return async (req, res, next) => {
    try {
      const pattern = generateCachePattern(namespace);
      await RedisService.deletePattern(pattern);
      console.log(`Cache cleared for namespace: ${namespace}`);
      next();
    } catch (error) {
      console.error(`Clear cache error for ${namespace}:`, error.message);
      next();
    }
  };
};

// Legacy clear cache by pattern
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

// Export cache config for use in routes
export { CACHE_TTL, CACHE_NAMESPACES, CACHE_ACTIONS, generateCacheKey, generateCachePattern };

export default cacheMiddleware;
