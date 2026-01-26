const redisClient = require("../config/redisClient");
const { logger } = require("./logger");

/**
 * Get cached data from Redis
 * @param {string} key - Cache key
 * @returns {Promise<string|null>} - Cached data or null
 */
const getCache = async (key) => {
  try {
    return await redisClient.get(key);
  } catch (error) {
    logger.error(`Error getting cache for key ${key}:`, error);
    return null;
  }
};

/**
 * Set cache data in Redis with expiration
 * @param {string} key - Cache key
 * @param {string} value - Data to cache (should be stringified)
 * @param {number} ttl - Time to live in seconds (default: 300 = 5 minutes)
 */
const setCache = async (key, value, ttl = 300) => {
  try {
    await redisClient.setEx(key, ttl, value);
    logger.info(`Cache set for key: ${key}`);
  } catch (error) {
    logger.error(`Error setting cache for key ${key}:`, error);
  }
};

/**
 * Clear order-related cache entries
 * @param {number} userId - The user ID to clear cache for
 * @param {number} orderId - The order ID to clear cache for
 */
const clearOrderCache = async (userId, orderId) => {
  try {
    // Clear specific order cache
    if (orderId) {
      await redisClient.del(`order:${orderId}`);
      logger.info(`Cleared cache for order:${orderId}`);
    }

    // Clear user's order list caches
    if (userId) {
      const keys = await redisClient.keys(`order:user:${userId}:*`);
      if (keys && keys.length > 0) {
        await redisClient.del(keys);
        logger.info(
          `Cleared ${keys.length} order cache entries for user:${userId}`,
        );
      }
    }
  } catch (error) {
    logger.error("Error clearing order cache:", error);
  }
};

module.exports = {
  getCache,
  setCache,
  clearOrderCache,
};
