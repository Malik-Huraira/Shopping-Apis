const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const config = require("../config");
const router = express.Router();

// Auth Service Proxy
router.use(
  "/auth",
  createProxyMiddleware({
    target: config.services.auth,
    changeOrigin: true,
    pathRewrite: {
      "^/auth": "/api/auth",
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(
        `[Auth] ${req.method} ${req.originalUrl} -> ${config.services.auth}${req.path.replace("/auth", "/api/auth")}`,
      );

      // Forward authorization header
      if (req.headers.authorization) {
        proxyReq.setHeader("Authorization", req.headers.authorization);
      }

      // Handle body for POST/PUT/PATCH
      if (req.body && Object.keys(req.body).length > 0) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader("Content-Type", "application/json");
        proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },
    onError: (err, req, res) => {
      console.error("Auth Service Proxy Error:", err.message);
      res.status(503).json({
        error: "Service unavailable",
        message: "Auth service is currently unavailable",
        timestamp: new Date().toISOString(),
      });
    },
  }),
);

// Product Service Proxy
router.use(
  "/products",
  createProxyMiddleware({
    target: config.services.product,
    changeOrigin: true,
    pathRewrite: {
      "^/products": "/api/products",
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(
        `[Product] ${req.method} ${req.originalUrl} -> ${config.services.product}${req.path.replace("/products", "/api/products")}`,
      );

      if (req.headers.authorization) {
        proxyReq.setHeader("Authorization", req.headers.authorization);
      }

      if (req.body && Object.keys(req.body).length > 0) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader("Content-Type", "application/json");
        proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },
    onError: (err, req, res) => {
      console.error("Product Service Proxy Error:", err.message);
      res.status(503).json({
        error: "Service unavailable",
        message: "Product service is currently unavailable",
        timestamp: new Date().toISOString(),
      });
    },
  }),
);

// Order Service Proxy
router.use(
  "/orders",
  createProxyMiddleware({
    target: config.services.order,
    changeOrigin: true,
    pathRewrite: {
      "^/orders": "/api/orders",
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(
        `[Order] ${req.method} ${req.originalUrl} -> ${config.services.order}${req.path.replace("/orders", "/api/orders")}`,
      );

      if (req.headers.authorization) {
        proxyReq.setHeader("Authorization", req.headers.authorization);
      }

      if (req.body && Object.keys(req.body).length > 0) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader("Content-Type", "application/json");
        proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },
    onError: (err, req, res) => {
      console.error("Order Service Proxy Error:", err.message);
      res.status(503).json({
        error: "Service unavailable",
        message: "Order service is currently unavailable",
        timestamp: new Date().toISOString(),
      });
    },
  }),
);

// User Service Proxy
router.use(
  "/users",
  createProxyMiddleware({
    target: config.services.user,
    changeOrigin: true,
    pathRewrite: {
      "^/users": "/api/users",
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(
        `[User] ${req.method} ${req.originalUrl} -> ${config.services.user}${req.path.replace("/users", "/api/users")}`,
      );

      if (req.headers.authorization) {
        proxyReq.setHeader("Authorization", req.headers.authorization);
      }

      if (req.body && Object.keys(req.body).length > 0) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader("Content-Type", "application/json");
        proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },
    onError: (err, req, res) => {
      console.error("User Service Proxy Error:", err.message);
      res.status(503).json({
        error: "Service unavailable",
        message: "User service is currently unavailable",
        timestamp: new Date().toISOString(),
      });
    },
  }),
);

// Email Service Proxy
router.use(
  "/emails",
  createProxyMiddleware({
    target: config.services.email,
    changeOrigin: true,
    pathRewrite: {
      "^/emails": "/api/emails",
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(
        `[Email] ${req.method} ${req.originalUrl} -> ${config.services.email}${req.path.replace("/emails", "/api/emails")}`,
      );

      if (req.headers.authorization) {
        proxyReq.setHeader("Authorization", req.headers.authorization);
      }

      if (req.body && Object.keys(req.body).length > 0) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader("Content-Type", "application/json");
        proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },
    onError: (err, req, res) => {
      console.error("Email Service Proxy Error:", err.message);
      res.status(503).json({
        error: "Service unavailable",
        message: "Email service is currently unavailable",
        timestamp: new Date().toISOString(),
      });
    },
  }),
);

// Chat Service Proxy
router.use(
  "/chat",
  createProxyMiddleware({
    target: config.services.chat,
    changeOrigin: true,
    pathRewrite: {
      "^/chat": "/api/chat",
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(
        `[Chat] ${req.method} ${req.originalUrl} -> ${config.services.chat}${req.path.replace("/chat", "/api/chat")}`,
      );

      if (req.headers.authorization) {
        proxyReq.setHeader("Authorization", req.headers.authorization);
      }

      if (req.body && Object.keys(req.body).length > 0) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader("Content-Type", "application/json");
        proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },
    onError: (err, req, res) => {
      console.error("Chat Service Proxy Error:", err.message);
      res.status(503).json({
        error: "Service unavailable",
        message: "Chat service is currently unavailable",
        timestamp: new Date().toISOString(),
      });
    },
  }),
);

module.exports = router;
