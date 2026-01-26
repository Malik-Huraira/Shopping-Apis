const { Sequelize } = require("sequelize");
const config = require("./index");
const { logger } = require("../utils/logger");

const sequelize = new Sequelize(
  config.database.database,
  config.database.username,
  config.database.password,
  {
    host: config.database.host,
    port: config.database.port,
    dialect: config.database.dialect,
    logging: config.database.logging,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: true,
      underscored: true,
    },
  },
);

// Test connection
sequelize
  .authenticate()
  .then(() => {
    logger.info("Database connection established");
  })
  .catch((error) => {
    logger.error("Database connection failed", {
      error: error.message,
    });
  });

module.exports = sequelize;
