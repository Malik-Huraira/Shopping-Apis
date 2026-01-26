const kafka = require("../kafka/client");
const consumer = kafka.consumer({ groupId: "product-group" });
const { logger } = require("../utils/logger");

const {
  updateStock,
  restoreStock,
} = require("../services/productStockService");

const startConsumer = async () => {
  await consumer.connect();

  await consumer.subscribe({ topic: "order.placed", fromBeginning: false });
  await consumer.subscribe({ topic: "order.deleted", fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const data = JSON.parse(message.value.toString());
      logger.info(`📦 [${topic}] Message Received:`, data);

      switch (topic) {
        case "order.placed":
          await updateStock(data.items);
          logger.info("✅ Stock updated based on placed order");
          break;

        case "order.deleted":
          await restoreStock(data.items);
          logger.info("♻️ Stock restored from deleted order");
          break;
      }
    },
  });
};

module.exports = { startConsumer };
