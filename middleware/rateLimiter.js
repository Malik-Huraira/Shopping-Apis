const rateLimit = require('express-rate-limit');

// Configuration
const createRateLimiter = (options = {}) => {
    const {
        windowMs = 15 * 60 * 1000, // 15 minutes
        max = 10, // limit each IP to 10 requests per windowMs
        message = 'Too many requests, please try again later.',
        skipPaths = [] // paths to exclude from rate limiting
    } = options;

    const limiter = rateLimit({
        windowMs,
        max,
        standardHeaders: true, // sends RateLimit headers
        legacyHeaders: false, // disable X-RateLimit headers
        message: (req, res) => ({
            error: message,
            limit: max,
            timeWindow: `${windowMs / 60000} minutes`,
            path: req.originalUrl
        }),
        skip: (req) => skipPaths.includes(req.path),
        handler: (req, res, next, options) => {
            console.warn(`🚫 Rate limit exceeded: ${req.ip} tried accessing ${req.originalUrl}`);
            res.status(429).json(options.message(req, res));
        }
    });

    return limiter;
};

module.exports = createRateLimiter;
