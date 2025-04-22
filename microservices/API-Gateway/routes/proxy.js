const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const router = express.Router();

// === AUTH SERVICE ===
router.use('/api/auth', createProxyMiddleware({
    target: 'http://localhost:5001',
    changeOrigin: true,
    pathRewrite: { '^/api/auth': '' },
    timeout: 10000,
}));

// === EMAIL SERVICE ===
router.use('/api/email', createProxyMiddleware({
    target: 'http://localhost:5002',
    changeOrigin: true,
    pathRewrite: { '^/api/email': '' },
    timeout: 10000,
}));

// === ORDER SERVICE ===
router.use('/api/orders', createProxyMiddleware({
    target: 'http://localhost:5003',
    changeOrigin: true,
    pathRewrite: { '^/api/orders': '' },
    timeout: 10000,
}));

// === PRODUCT SERVICE ===
router.use('/api/products', createProxyMiddleware({
    target: 'http://localhost:5004',
    changeOrigin: true,
    pathRewrite: { '^/api/products': '' },
    timeout: 10000,
}));

// === USER SERVICE ===
router.use('/api/users', createProxyMiddleware({
    target: 'http://localhost:5005',
    changeOrigin: true,
    pathRewrite: { '^/api/users': '' },
    timeout: 10000,
}));

module.exports = router;
