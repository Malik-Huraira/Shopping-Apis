// kafka/client.js
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'auth-service', // Give a unique client ID
    brokers: ['localhost:9092'], // Or your broker IP/hostname
});

module.exports = kafka;