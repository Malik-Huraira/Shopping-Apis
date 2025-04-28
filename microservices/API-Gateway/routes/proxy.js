const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const router = express.Router();

// Centralized body handling
function handleProxyRequest(proxyReq, req) {
    if (req.body && Object.keys(req.body).length > 0) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
    }
}

// Centralized error handling
function handleProxyError(serviceName) {
    return (err, req, res) => {
        console.error(`${serviceName} Proxy Error:`, {
            error: err.message,
            code: err.code,
            url: req.originalUrl,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });

        if (err.code === 'ECONNREFUSED') {
            return res.status(503).json({
                error: 'Service unavailable',
                message: `${serviceName} is currently unavailable`,
                timestamp: new Date().toISOString()
            });
        }

        if (err.code === 'ETIMEDOUT') {
            return res.status(504).json({
                error: 'Gateway timeout',
                message: `${serviceName} timed out`,
                timestamp: new Date().toISOString()
            });
        }

        if (err.code === 'ECONNRESET') {
            return res.status(502).json({
                error: 'Bad gateway',
                message: `Connection to ${serviceName} was reset`,
                timestamp: new Date().toISOString()
            });
        }

        res.status(500).json({
            error: 'Internal server error',
            message: `Unexpected error occurred while processing request to ${serviceName}`,
            timestamp: new Date().toISOString()
        });
    };
}

// Create proxy easily
function createServiceProxy(basePath, target, serviceName, rewrite = false) {
    const options = {
        target,
        changeOrigin: true,
        timeout: 10000,
        onProxyReq: handleProxyRequest,
        onProxyRes: (proxyRes, req, res) => {
            console.log(`${serviceName} responded with status: ${proxyRes.statusCode}`);
        },
        onError: handleProxyError(serviceName)
    };

    if (rewrite) {
        options.pathRewrite = { [`^${basePath}`]: '' };
    }

    router.use(basePath, createProxyMiddleware(options));
}

// Now, easily add all services here:
createServiceProxy('/api/auth', 'http://localhost:5001', 'Auth Service');
createServiceProxy('/api/email', 'http://localhost:5002', 'Email Service');
createServiceProxy('/api/orders', 'http://localhost:5003', 'Order Service');
createServiceProxy('/api/products', 'http://localhost:5004', 'Product Service');
createServiceProxy('/api/users', 'http://localhost:5005', 'User Service');

module.exports = router;
