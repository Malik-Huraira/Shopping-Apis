const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "email-service",
  brokers: [process.env.KAFKA_BROKER || "kafka_broker:9092"],
});
module.exports = kafka;
