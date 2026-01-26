const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
require("dotenv").config();
const productRouter = require("./routes/productRouter");
const authenticateUser = require("./middleware/authmiddleware");
const createRateLimiter = require("./middleware/rateLimiter");
const sequelize = require("./config/sequelize");
const config = require("./config");
const { startConsumer } = require("./kafka/consumer");
const logger = require("./utils/logger").logger;
const Product = require("./model/product"); // Import the model to ensure it's registered
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(bodyParser.json());

// Rate limiter middleware
app.use(
  "/api",
  createRateLimiter({
    windowMs: 1 * 60 * 1000,
    max: 5,
    message: "You're going too fast!",
    skipPaths: ["/api/auth/login"],
  }),
);
app.use((err, req, res, next) => {
  if (err.message === "You're going too fast!") {
    return res.status(429).json({ error: err.message });
  }
  next(err);
});

// Routers
app.use("/api/products", productRouter);
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", service: "Product Service" });
});

startConsumer().then(() => logger.info("📦 Product Kafka Consumer started"));

// Sync database and start server
sequelize
  .sync({ force: false })
  .then(() => {
    logger.info("Database & tables created!");

    // Start HTTPS server
    app.listen(config.app.port, () => {
      logger.info(
        `${config.app.name} running in ${config.env} mode on port ${config.app.port}`,
      );
      logger.info(`Base URL: ${config.app.baseUrl}`);
    });
  })
  .catch((err) => {
    logger.error("Unable to sync database:", err);
  });
