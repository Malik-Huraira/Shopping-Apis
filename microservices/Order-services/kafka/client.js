const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "order-service",
  brokers: [process.env.KAFKA_BROKER || "kafka_broker:9092"],
});

module.exports = kafka;
