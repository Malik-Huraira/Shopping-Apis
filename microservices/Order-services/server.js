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

const app = express();


sequelize.sync({ force: false })
    .then(() => {
        console.log('Database & tables created!');
    })
    .catch((error) => {
        console.error('Error creating database & tables:', error);
    });
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

app.use('/api/orders', orderRouter);
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', service: 'Order Service' });
});

// Start HTTPS server
const PORT = 5003;
app.listen(PORT, () => {
    console.log(`🔐 HTTPS server running at https://localhost:${PORT}`);
});

