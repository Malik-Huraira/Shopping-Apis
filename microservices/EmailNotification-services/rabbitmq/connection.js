const amqp = require('amqplib');
let channel;
const connectRabbitMQ = async () => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
        channel = await connection.createChannel();
        console.log('✅ RabbitMQ connected and channel created (Email Service)');
    } catch (error) {
        console.error('❌ RabbitMQ connection error (Email Service):', error);
        throw error;
    }
};

const getChannel = () => channel;

module.exports = {
    connectRabbitMQ,
    getChannel,
};
