const { getChannel } = require('./connection');
const { sendEmail } = require('../utils/email'); // Adjust path if needed

const queues = {
    product: 'product_created',
    order: 'order_created'
};

const startConsumer = async () => {
    const channel = getChannel();
    if (!channel) {
        throw new Error('RabbitMQ channel is not initialized');
    }

    // ----- Order Created Consumer -----
    await channel.assertQueue(queues.order, { durable: true });
    console.log(`🐰 Waiting for messages in queue: ${queues.order}`);

    channel.consume(queues.order, async (msg) => {
        if (msg !== null) {
            try {
                const orderEvent = JSON.parse(msg.content.toString());
                console.log('📥 Received order event:', orderEvent);

                const { user_email, user_name, order_id, total_price, items } = orderEvent;

                if (!user_email || !user_name || !order_id || !total_price || !items) {
                    console.error('❌ Missing fields in order event:', orderEvent);
                    channel.nack(msg, false, false);
                    return;
                }

                const subject = `Order Confirmation - #${order_id}`;
                const message = `
                    Hi ${user_name},<br/><br/>
                    Thank you for your order!<br/>
                    Your order with ID <strong>${order_id}</strong> has been placed successfully.<br/>
                    <strong>Total:</strong> $${total_price}<br/><br/>
                    <h3>Order Details:</h3>
                    <ul>
                        ${items.map(item => `<li>${item.name} - $${item.price} - ${item.description}</li>`).join('')}
                    </ul>
                    We’ll notify you once it's shipped.<br/><br/>
                    Regards,<br/>My App Team
                `;

                const result = await sendEmail(user_email, subject, message);
                result.success ? channel.ack(msg) : channel.nack(msg, false, false);

            } catch (error) {
                console.error('❌ Error processing order message:', error);
                channel.nack(msg, false, false);
            }
        }
    });

    // ----- Product Created Consumer -----
    await channel.assertQueue(queues.product, { durable: true });
    console.log(`🐰 Listening for messages in queue: ${queues.product}`);

    channel.consume(queues.product, async (msg) => {
        if (msg !== null) {
            try {
                const productEvent = JSON.parse(msg.content.toString());
                console.log('📥 Received product event:', productEvent);

                const { product_name, user_email, user_name, price , description} = productEvent;

                if (!user_email || !user_name || !product_name || !price|| !description) {
                    console.error('❌ Missing required fields in product message');
                    return channel.nack(msg, false, false);
                }

                const subject = `🎉 New Product Added: ${product_name}`;
                const message = `
                    Hello ${user_name},<br/><br/>
                    A new product <strong>${product_name}</strong> has been added to the store.<br/>
                    <strong>Price:</strong> $${price}<br/><br/>
                    <h3>Product Details:</h3>
                    <ul>${description}</ul>
                    Visit us now to check it out!<br/><br/>
                    Regards,<br/>My App Team
                `;

                const result = await sendEmail(user_email, subject, message);
                result.success ? channel.ack(msg) : channel.nack(msg, false, false);

            } catch (error) {
                console.error('❌ Error processing product message:', error.message);
                channel.nack(msg, false, false);
            }
        }
    });
};

module.exports = { startConsumer };
