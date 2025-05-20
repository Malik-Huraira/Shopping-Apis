const { getChannel } = require('./Connection');

const publishProductCreated = async ({ product_name,description, user_email, user_name, price }) => {
    const channel = getChannel();
    const queue = 'product_created';

    if (!channel) {
        throw new Error('RabbitMQ channel is not initialized');
    }

    const message = { product_name, description, user_email, user_name, price };

    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });

    console.log(`📤 Sent product_created message to queue:`, message);
};

module.exports = {
    publishProductCreated,
};
