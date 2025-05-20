const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
require('dotenv').config();
const productRouter = require('./routes/productRouter');
const authenticateUser = require('./middleware/authmiddleware');
const createRateLimiter = require('./middleware/rateLimiter');
const { connectRabbitMQ } = require('./rabbitmq/Connection');
const sequelize = require('./config/sequelize')
const config = require('./config');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(bodyParser.json());

// Rate limiter middleware
app.use('/api', createRateLimiter({
    windowMs: 1 * 60 * 1000,
    max: 5,
    message: "You're going too fast!",
    skipPaths: ['/api/auth/login']
}));
app.use((err, req, res, next) => {
    if (err.message === "You're going too fast!") {
        return res.status(429).json({ error: err.message });
    }
    next(err);
});

// Routers
app.use('/api/products', productRouter);
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', service: 'Product Service' });
});

// Start HTTPS server

(async () => {
    try {
        await connectRabbitMQ();
        console.log('📦 Product Service is connected to RabbitMQ...');
       
        app.listen(config.app.port, () => {
            console.log(`${config.app.name} running in ${config.env} mode on port ${config.app.port}`);
            console.log(`Base URL: ${config.app.baseUrl}`);
            });
    } catch (error) {
        console.error('Failed to start server due to RabbitMQ connection error:', error);
        process.exit(1);
    }
})();