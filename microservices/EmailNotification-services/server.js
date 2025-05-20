const express = require('express');
const emailRouter = require('./routes/emailRouter');
const sequelize = require('./config/sequelize');
require('./cron/sendPendingEmails');
const { connectRabbitMQ } = require('./rabbitmq/connection');
const { startConsumer } = require('./rabbitmq/consumer');
const app = express();

// Middleware
app.use(express.json());

// Routers

app.use('/api/email', emailRouter);
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', service: 'Email Service' });
});


// Start HTTPS server
(async () => {
    try {
        await connectRabbitMQ();
        await startConsumer();
        console.log('📧 Email Service is listening for order_created messages...');
        const PORT = 5002
        app.listen(PORT, () => {
            console.log(`🔐 HTTPS server running at https://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start Email Service:', error);
        process.exit(1);
    }
})();