const { Kafka } = require("kafkajs");
const config = require("../config");
const { logger } = require("../utils/logger");

let producer = null;

const initProducer = async () => {
  try {
    const kafka = new Kafka({
      clientId: config.kafka.clientId,
      brokers: config.kafka.brokers,
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    });

    producer = kafka.producer({
      allowAutoTopicCreation: true,
      transactionTimeout: 30000,
    });

    await producer.connect();
    logger.info("Kafka producer connected", {
      brokers: config.kafka.brokers,
    });

    // Handle producer errors
    producer.on("producer.connect", () => {
      logger.info("Producer connected to Kafka");
    });

    producer.on("producer.disconnect", () => {
      logger.warn("Producer disconnected from Kafka");
    });

    producer.on("producer.network.request", ({ payload }) => {
      logger.debug("Producer network request", { payload });
    });

    return producer;
  } catch (error) {
    logger.error("Failed to initialize Kafka producer", {
      error: error.message,
    });
    throw error;
  }
};

const publishEvent = async (topic, messages) => {
  try {
    if (!producer) {
      await initProducer();
    }

    const result = await producer.send({
      topic,
      messages,
      timeout: 30000,
    });

    logger.info("Event published to Kafka", {
      topic,
      messageCount: messages.length,
    });

    return result;
  } catch (error) {
    logger.error("Failed to publish event to Kafka", {
      topic,
      error: error.message,
    });
    throw error;
  }
};

const disconnectProducer = async () => {
  try {
    if (producer) {
      await producer.disconnect();
      logger.info("Kafka producer disconnected");
    }
  } catch (error) {
    logger.error("Error disconnecting Kafka producer", {
      error: error.message,
    });
  }
};

module.exports = {
  initProducer,
  publishEvent,
  disconnectProducer,
};
