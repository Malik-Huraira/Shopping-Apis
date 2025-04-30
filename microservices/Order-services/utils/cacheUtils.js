const redisClient = require('../config/redisClient');
// Utility function to wrap Redis `keys` method in a promise
const getKeys = (pattern) => {
    return new Promise((resolve, reject) => {
        redisClient.keys(pattern, (err, keys) => {
            if (err) return reject(err);
            resolve(keys);
        });
    });
};

// Utility function to wrap Redis `del` method in a promise
const deleteKeys = (keys) => {
    return new Promise((resolve, reject) => {
        redisClient.del(keys, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// Clear product cache
const clearProductCache = async () => {
    try {
        const keys = await getKeys('product:*');
        if (!keys || keys.length === 0) return;

        const result = await deleteKeys(keys);
        console.log(`Cleared ${result} product cache entries.`);
    } catch (err) {
        console.error('Error clearing product cache:', err);
    }
};

// Get cache (with callback)
const getCache = async (key) => {
    return new Promise((resolve, reject) => {
        redisClient.get(key, (err, data) => {
            if (err) return reject(err);
            resolve(data ? JSON.parse(data) : null);
        });
    });
};

// Set cache with expiration time
const setCache = (key, value, expirationInSeconds = 3600) => {
    return new Promise((resolve, reject) => {
        redisClient.set(key, JSON.stringify(value), 'EX', expirationInSeconds, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// Clear order cache
const clearOrderCache = async (userId = null, orderId = null) => {
    try {
        let pattern = 'order:*';
        if (userId) pattern = `order:user:${userId}:*`;
        if (orderId) pattern = `order:${orderId}`;

        const keys = await getKeys(pattern);
        if (keys.length > 0) {
            const result = await deleteKeys(keys);
            console.log(`Cleared ${result} order cache keys`);
        }
    } catch (err) {
        console.error('Error clearing order cache:', err);
    }
};

module.exports = {
    clearProductCache,
    getCache,
    setCache,
    clearOrderCache
};
