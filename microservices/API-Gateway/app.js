const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const axios = require("axios");
require("dotenv").config();

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:3000"],
    credentials: true,
  }),
);

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Logging
app.use(morgan("combined"));

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "API Gateway",
    timestamp: new Date().toISOString(),
  });
});

// Check all microservices health
app.get("/health/all", async (req, res) => {
  const services = {
    auth: `http://auth-service:5001/health`,
    product: `http://product-service:5004/health`,
    order: `http://order-service:5003/health`,
    user: `http://user-service:5005/health`,
    email: `http://email-service:5002/health`,
    chat: `http://chat-service:5006/health`,
  };

  const results = {};

  for (const [name, url] of Object.entries(services)) {
    try {
      const response = await axios.get(url, { timeout: 5000 });
      results[name] = {
        status: "healthy",
        statusCode: response.status,
      };
    } catch (error) {
      results[name] = {
        status: "unhealthy",
        error: error.message,
      };
    }
  }

  const allHealthy = Object.values(results).every(
    (r) => r.status === "healthy",
  );

  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? "OK" : "DEGRADED",
    services: results,
    timestamp: new Date().toISOString(),
  });
});

// Proxy routes
app.use("/api", require("./routes/proxy"));

// Error handling
app.use((err, req, res, next) => {
  console.error("Gateway Error:", err);

  res.status(err.status || 500).json({
    error: "Gateway Error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "An error occurred",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: "Endpoint not found",
    timestamp: new Date().toISOString(),
  });
});

module.exports = app;
