// Cache configuration for Redis Insight friendly structure
// Using hierarchical key naming: app:resource:action:params

export const CACHE_PREFIX = "sneaker";

export const CACHE_TTL = {
  SHORT: 60,      // 1 minute
  MEDIUM: 300,    // 5 minutes
  LONG: 600,      // 10 minutes
  VERY_LONG: 3600 // 1 hour
};

export const CACHE_NAMESPACES = {
  PRODUCTS: "products",
  CATEGORIES: "categories",
  BRANDS: "brands",
  USERS: "users",
  ORDERS: "orders",
  CART: "cart",
  NEWS: "news",
  HOME_SECTIONS: "home-sections",
  COUPONS: "coupons",
  REVIEWS: "reviews",
  FAVORITES: "favorites",
  PROMOTIONS: "promotions"
};

export const CACHE_ACTIONS = {
  LIST: "list",
  DETAIL: "detail",
  SLUG: "slug",
  BY_ID: "by-id",
  BY_USER: "by-user",
  ACTIVE: "active",
  STATS: "stats",
  PRODUCTS: "products"
};

// Generate hierarchical key: sneaker:products:list:{params}
export const generateCacheKey = (namespace, action, params = {}) => {
  const baseKey = `${CACHE_PREFIX}:${namespace}:${action}`;
  
  if (Object.keys(params).length === 0) {
    return baseKey;
  }
  
  // Sort params for consistent keys
  const sortedParams = Object.keys(params)
    .sort()
    .filter(key => params[key] !== undefined && params[key] !== null && params[key] !== '')
    .map(key => {
      // Sanitize value - remove special characters that might break key structure
      const value = String(params[key]).replace(/[:\/\s]/g, '_');
      return `${key}:${value}`;
    })
    .join(":");
  
  return sortedParams ? `${baseKey}:${sortedParams}` : baseKey;
};

// Generate pattern for clearing cache
export const generateCachePattern = (namespace, action = '*') => {
  return `${CACHE_PREFIX}:${namespace}:${action}*`;
};

export default {
  CACHE_PREFIX,
  CACHE_TTL,
  CACHE_NAMESPACES,
  CACHE_ACTIONS,
  generateCacheKey,
  generateCachePattern
};
