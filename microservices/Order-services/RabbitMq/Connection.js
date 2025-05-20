const amqp = require('amqplib');
require('dotenv').config();
let channel;

const connectRabbitMQ = async () => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();
        console.log('✅ RabbitMQ connected and channel created');
    } catch (error) {
        console.error('❌ RabbitMQ connection error:', error);
        throw error;
    }
};

const getChannel = () => channel;

module.exports = {
    connectRabbitMQ,
    getChannel,
};
