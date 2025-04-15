const rateLimit = require('express-rate-limit');
const HTTP = require('../utils/httpStatusCodes'); // Import your HTTP status codes

// Configuration for the rate limiter
const createRateLimiter = (options = {}) => {
    const {
        windowMs = 15 * 60 * 1000, // 15 minutes
        max = 10, // Limit each IP to 10 requests per windowMs
        message = 'Too many requests, please try again later.',
        skipPaths = [] // Paths to exclude from rate limiting
    } = options;

    const limiter = rateLimit({
        windowMs,
        max,
        standardHeaders: true, // Sends RateLimit headers (X-RateLimit-*)
        legacyHeaders: false, // Disable the older X-RateLimit headers
        message: (req, res) => ({
            error: message,
            limit: max,
            timeWindow: `${windowMs / 60000} minutes`, // Convert windowMs to minutes
            path: req.originalUrl
        }),
        skip: (req) => skipPaths.includes(req.path), // Skip rate limiting for specific paths
        handler: (req, res, next, options) => {
            console.warn(`🚫 Rate limit exceeded: ${req.ip} tried accessing ${req.originalUrl}`);
            res.status(HTTP.TooManyRequests).json(options.message(req, res)); // Send 429 status with custom message
        }
    });

    return limiter;
};

module.exports = createRateLimiter;
