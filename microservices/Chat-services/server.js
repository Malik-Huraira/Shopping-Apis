require("dotenv").config();
const app = require("./src/app");
const http = require("http");
const socketHandler = require("./src/socket/index");
const sequelize = require("./src/config/db");
const { logger } = require("./src/utils/logger");

const PORT = process.env.PORT || 5006;
const NODE_ENV = process.env.NODE_ENV || "development";

const server = http.createServer(app);

// Attach socket handler
socketHandler(server);

// Graceful shutdown
const gracefulShutdown = (signal) => {
  logger.info(`Received ${signal}, starting graceful shutdown...`);

  server.close(() => {
    logger.info("Server closed");
    process.exit(0);
  });

  // Force exit after 10 seconds
  setTimeout(() => {
    logger.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Database sync and server start
sequelize
  .sync({ alter: NODE_ENV === "development" })
  .then(() => {
    logger.info("Database connected and synchronized");

    server.listen(PORT, () => {
      logger.info("Chat Service started", {
        port: PORT,
        environment: NODE_ENV,
      });
    });
  })
  .catch((err) => {
    logger.error("Unable to connect to the database", {
      error: err.message,
    });
    process.exit(1);
  });

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "Chat Service",
    timestamp: new Date().toISOString(),
  });
});

module.exports = server;
