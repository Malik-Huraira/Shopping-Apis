require("dotenv").config();

const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",

  services: {
    auth: process.env.AUTH_SERVICE_URL || "http://auth-service:5001",
    product: process.env.PRODUCT_SERVICE_URL || "http://product-service:5004",
    order: process.env.ORDER_SERVICE_URL || "http://order-service:5003",
    user: process.env.USER_SERVICE_URL || "http://user-service:5005",
    email: process.env.EMAIL_SERVICE_URL || "http://email-service:5002",
    chat: process.env.CHAT_SERVICE_URL || "http://chat-service:5006",
  },

  cors: {
    origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:3000"],
    credentials: true,
  },

  logging: {
    level: process.env.LOG_LEVEL || "info",
    format: process.env.LOG_FORMAT || "json",
  },

  proxy: {
    timeout: 30000,
    retries: 3,
  },
};

module.exports = config;
