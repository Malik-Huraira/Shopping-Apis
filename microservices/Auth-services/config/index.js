require("dotenv").config();

const config = {
  port: process.env.PORT || 5001,
  nodeEnv: process.env.NODE_ENV || "development",
  baseUrl: process.env.BASE_URL || "http://localhost:5001",

  database: {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "auth",
    dialect: "mysql",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  },

  kafka: {
    brokers: (process.env.KAFKA_BROKERS || "localhost:9092").split(","),
    clientId: "auth-service",
  },

  logging: {
    level: process.env.LOG_LEVEL || "info",
    format: process.env.LOG_FORMAT || "json",
  },

  cron: {
    enabled: process.env.ENABLE_CRON === "true",
  },

  rateLimiter: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },
};

// Validate required environment variables
const requiredEnvVars = ["JWT_SECRET", "DB_PASSWORD"];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`,
  );
}

module.exports = config;
