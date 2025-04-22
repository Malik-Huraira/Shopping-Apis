// cacheUtils.js
const redisClient = require('../config/redisClient');

const clearProductCache = () => {
    redisClient.keys('product:*', (err, keys) => {
        if (err) {
            console.error('Redis keys error:', err);
            return;
        }

        if (!keys || keys.length === 0) return;

        redisClient.del(keys, (err, result) => {
            if (err) {
                console.error('Redis del error:', err);
            } else {
                console.log(`Cleared ${result} product cache entries.`);
            }
        });
    });
};

const getCache = (key, callback) => {
    redisClient.get(key, (err, data) => {
        if (err) return callback(err);
        callback(null, data ? JSON.parse(data) : null);
    });
};

const setCache = (key, value, expirationInSeconds = 3600) => {
    redisClient.set(key, JSON.stringify(value), 'EX', expirationInSeconds);
};

const clearOrderCache = (userId = null, orderId = null) => {
    let pattern = 'order:*';
    if (userId) pattern = `order:user:${userId}:*`;
    if (orderId) pattern = `order:${orderId}`;

    redisClient.keys(pattern, (err, keys) => {
        if (err) return console.error('Redis keys error:', err);
        if (keys.length > 0) {
            redisClient.del(keys, (err, count) => {
                if (err) return console.error('Redis del error:', err);
                console.log(`Cleared ${count} order cache keys`);
            });
        }
    });
};

module.exports = {
    clearProductCache,
    getCache,
    setCache,
    clearOrderCache
};
