require("dotenv").config();
const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");
const app = require("./app");

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Graceful shutdown handler
const gracefulShutdown = (signal) => {
  console.log(`\nReceived ${signal}, starting graceful shutdown...`);

  httpServer.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });

  // Force exit after 10 seconds
  setTimeout(() => {
    console.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Create HTTP server
const httpServer = http.createServer(app);

// Add HTTPS redirect middleware
app.use((req, res, next) => {
  if (NODE_ENV === "production" && !req.secure) {
    return res.redirect(`https://${req.get("host")}${req.url}`);
  }
  next();
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`API Gateway running on http://localhost:${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
});

// Handle server errors
httpServer.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use`);
  } else {
    console.error("Server error:", error);
  }
  process.exit(1);
});

module.exports = httpServer;
