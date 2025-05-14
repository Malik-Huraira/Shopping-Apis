const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'product-service',
    brokers: ['localhost:9092'], // or Docker host if using containers
});

module.exports = kafka;
