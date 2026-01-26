const kafka = require("../kafka/client");
const { logger } = require("../utils/logger");

const producer = kafka.producer();
const connectProducer = async () => {
  try {
    await producer.connect();
    logger.info("Producer connected");
  } catch (error) {
    logger.error("Error connecting Kafka producer:", error.message);
    throw error;
  }
};
const publishEvent = async (topic, message) => {
  try {
    await producer.send({
      topic: topic,
      messages: [{ value: JSON.stringify(message) }],
    });
    logger.info(`Message sent to topic ${topic}: ${JSON.stringify(message)}`);
  } catch (error) {
    logger.error(`Error sending message to topic ${topic}:`, error);
  }
};
const disconnectProducer = async () => {
  await producer.disconnect();
  logger.info("Producer disconnected");
};

module.exports = {
  connectProducer,
  publishEvent,
  disconnectProducer,
};
