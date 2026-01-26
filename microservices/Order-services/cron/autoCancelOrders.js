const cron = require("node-cron");
const { Op } = require("sequelize");
const Order = require("../model/Order");
const { logger } = require("../utils/logger");

// Run every X minutes (e.g., every 5 min for testing)
cron.schedule("*/10 * * * *", async () => {
  logger.info("🔁 Running auto-cancel cron for orders...");

  try {
    const cutoff = new Date(Date.now() - 60 * 60 * 1000); // 60 minutes ago

    const result = await Order.update(
      { status: "cancelled" },
      {
        where: {
          status: "pending",
          createdAt: { [Op.lt]: cutoff },
        },
      },
    );

    logger.info(`✅ Cancelled ${result[0]} orders.`);
  } catch (err) {
    logger.error("❌ Cron error:", err.message);
  }
});
