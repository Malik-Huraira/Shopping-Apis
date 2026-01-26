const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const sequelize = require("./config/sequelize");
const userRouter = require("./routes/userRouter");
const authenticateUser = require("./middleware/authmiddleware");
const createRateLimiter = require("./middleware/rateLimiter");
const { logger } = require("./utils/logger");
require("dotenv").config();
const config = require("./config");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(bodyParser.json());

sequelize
  .sync({ force: false })
  .then(() => {
    logger.info("Database & tables created!");
  })
  .catch((error) => {
    logger.error("Error creating database & tables:", { error: error.message });
  });
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
app.use("/api/users", userRouter);
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", service: "User Service" });
});

// Start HTTPS server
app.listen(config.app.port, () => {
  logger.info(
    `${config.app.name} running in ${config.env} mode on port ${config.app.port}`,
  );
  logger.info(`Base URL: ${config.app.baseUrl}`);
});
