const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const sequelize = require('./config/sequelize')
const orderRouter = require('./routes/orderRouter');
const authenticateUser = require('./middleware/authmiddleware');
const { Order, OrderItem } = require('./model/associateModels');
const createRateLimiter = require('./middleware/rateLimiter');
require('dotenv').config();
const config = require('./config');
const app = express();


// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(bodyParser.json());

if (process.env.ENABLE_CRON === 'true') {
    require('./cron/autoCancelOrders');
}

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

app.use('/api/orders', orderRouter);
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', service: 'Order Service' });
});

// Start HTTPS server
app.listen(config.app.port, () => {
console.log(`${config.app.name} running in ${config.env} mode on port ${config.app.port}`);
console.log(`Base URL: ${config.app.baseUrl}`);
});

