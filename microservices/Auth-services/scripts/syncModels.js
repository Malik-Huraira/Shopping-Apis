require("dotenv").config();
const sequelize = require("../config/sequelize");
const { User, Role, Status, Session } = require("../model");
const { logger } = require("../utils/logger");

const syncModels = async () => {
  try {
    logger.info("Starting database synchronization...");

    // Sync all models
    await sequelize.sync({ alter: true });

    logger.info("Database synchronized successfully");

    // Seed default roles and statuses
    const roles = [
      { id: 1, name: "admin", description: "Administrator" },
      { id: 2, name: "user", description: "Regular User" },
    ];

    const statuses = [
      { id: 1, name: "active", description: "Active" },
      { id: 2, name: "inactive", description: "Inactive" },
    ];

    for (const role of roles) {
      await Role.findOrCreate({
        where: { id: role.id },
        defaults: role,
      });
    }

    for (const status of statuses) {
      await Status.findOrCreate({
        where: { id: status.id },
        defaults: status,
      });
    }

    logger.info("Default roles and statuses seeded");

    process.exit(0);
  } catch (error) {
    logger.error("Database synchronization failed", {
      error: error.message,
    });
    process.exit(1);
  }
};

syncModels();
