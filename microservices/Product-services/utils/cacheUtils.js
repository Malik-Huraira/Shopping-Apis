const redisClient = require("../config/redisClient");
const { logger } = require("./logger");

/**
 * Clear product-related cache entries
 * @param {number} productId - The product ID to clear cache for
 */
const clearProductCache = async (productId) => {
  try {
    // Clear specific product cache
    if (productId) {
      await redisClient.del(`product:${productId}`);
      logger.info(`Cleared cache for product:${productId}`);
    }

    // Clear all product list caches (pagination)
    const keys = await redisClient.keys("products:page=*");
    if (keys && keys.length > 0) {
      await redisClient.del(keys);
      logger.info(`Cleared ${keys.length} product list cache entries`);
    }
  } catch (error) {
    logger.error("Error clearing product cache:", error);
  }
};

module.exports = {
  clearProductCache,
};
