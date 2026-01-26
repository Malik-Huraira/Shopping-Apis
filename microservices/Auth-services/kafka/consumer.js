const { Kafka } = require("kafkajs");
const config = require("../config");
const { logger } = require("../utils/logger");

let consumer = null;

const initConsumer = async () => {
  try {
    const kafka = new Kafka({
      clientId: `${config.kafka.clientId}-consumer`,
      brokers: config.kafka.brokers,
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    });

    consumer = kafka.consumer({
      groupId: "auth-service-group",
      sessionTimeout: 30000,
      heartbeatInterval: 3000,
    });

    await consumer.connect();
    logger.info("Kafka consumer connected", {
      brokers: config.kafka.brokers,
    });

    consumer.on("consumer.connect", () => {
      logger.info("Consumer connected to Kafka");
    });

    consumer.on("consumer.disconnect", () => {
      logger.warn("Consumer disconnected from Kafka");
    });

    return consumer;
  } catch (error) {
    logger.error("Failed to initialize Kafka consumer", {
      error: error.message,
    });
    throw error;
  }
};

const subscribeToTopic = async (topic, messageHandler) => {
  try {
    if (!consumer) {
      await initConsumer();
    }

    await consumer.subscribe({ topic, fromBeginning: false });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const value = JSON.parse(message.value.toString());
          logger.debug("Message received from Kafka", {
            topic,
            partition,
            key: message.key?.toString(),
          });

          await messageHandler(value);
        } catch (error) {
          logger.error("Error processing Kafka message", {
            topic,
            error: error.message,
          });
        }
      },
    });

    logger.info("Subscribed to Kafka topic", { topic });
  } catch (error) {
    logger.error("Failed to subscribe to Kafka topic", {
      topic,
      error: error.message,
    });
    throw error;
  }
};

const disconnectConsumer = async () => {
  try {
    if (consumer) {
      await consumer.disconnect();
      logger.info("Kafka consumer disconnected");
    }
  } catch (error) {
    logger.error("Error disconnecting Kafka consumer", {
      error: error.message,
    });
  }
};

module.exports = {
  initConsumer,
  subscribeToTopic,
  disconnectConsumer,
};
