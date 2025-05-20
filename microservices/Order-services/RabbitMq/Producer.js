const { getChannel } = require('./Connection');

const publishOrderCreated = async (orderEvent) => {
    const channel = getChannel();
    if (!channel) {
        throw new Error('RabbitMQ channel is not initialized');
    }

    const queue = 'order_created';
    await channel.assertQueue(queue);
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(orderEvent)));
    console.log('📤 Order created event published to RabbitMQ');
};

module.exports = {
    publishOrderCreated,
};
