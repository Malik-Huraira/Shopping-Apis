const kafka = require('../kafka/client'); // Adjust the path as necessary
const consumer = kafka.consumer({ groupId: 'email-group' }); // unique group ID

const startConsumer = async () => {
    await consumer.connect();

    // Subscribe to order.placed
    await consumer.subscribe({ topic: 'order.placed', fromBeginning: false });

    // Subscribe to order.status.updated
    await consumer.subscribe({ topic: 'order.status.updated', fromBeginning: false });

    // Subscribe to order.deleted
    await consumer.subscribe({ topic: 'order.deleted', fromBeginning: false });

    await consumer.run({
        eachMessage: async ({ topic, message }) => {
            const data = JSON.parse(message.value.toString());
            console.log(`📩 [${topic}] Message Received:`, data);

            // Now call your email utility
            switch (topic) {
                case 'order.placed':
                    // sendOrderConfirmationEmail(data);
                    console.log(`✅ Send order confirmation to user ${data.user_id}`);
                    break;

                case 'order.status.updated':
                    // sendOrderStatusUpdateEmail(data);
                    console.log(`📦 Send order status update for order ${data.order_id}`);
                    break;

                case 'order.deleted':
                    // sendOrderCancellationEmail(data);
                    console.log(`❌ Send order cancellation notice for order ${data.order_id}`);
                    break;
            }
        }
    });
};

module.exports = { startConsumer };
