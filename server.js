const express = require('express');
const cors = require('cors');
const fs = require('fs');
const helmet = require('helmet');
const https = require('https');
require('dotenv').config();

const userRouter = require('./routes/userRouter');
const orderRouter = require('./routes/orderRouter');
const productRouter = require('./routes/productRouter');
const authRouter = require('./routes/authRouter');
const authenticateUser = require('./middleware/authmiddleware');
const createRateLimiter = require('./middleware/rateLimiter');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());

// Rate limiter middleware
app.use('/api', createRateLimiter({
    windowMs: 1 * 60 * 1000,
    max: 5,
    message: "You're going too fast!",
    skipPaths: ['/api/auth/login']
}));

// Routers
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/products', productRouter);
app.use('/api/auth', authRouter);

// Global authentication middleware (after public routes)
app.use(authenticateUser);

// Protected route example
app.get('/profile', (req, res) => {
    res.json({ message: "This is a protected profile", user: req.user });
});

// Load SSL certificate
const sslOptions = {
    key: fs.readFileSync('./ssl/server.key'),
    cert: fs.readFileSync('./ssl/server.cert')
};

// Start HTTPS server
const PORT = 443;
https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`🔐 HTTPS server running at https://localhost:${PORT}`);
});
