const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const userRouter = require('./routes/userRouter');
const orderRouter = require('./routes/orderRouter');
const productRouter = require('./routes/productRouter')
const authRouter = require('./routes/authRouter');
const  authenticateUser  = require('./middleware/authmiddleware');
const createRateLimiter = require('./middleware/rateLimiter');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use('/api', createRateLimiter({
    windowMs: 1 * 60 * 1000, 
    max: 5, 
    message: "You're going too fast!",
    skipPaths: ['/api/auth/login'] 
}));

// Rate Limiters routes here
app.use('/api/users', require('./routes/userRouter'));
app.use('/api/orders', require('./routes/orderRouter'));
app.use('/api/products', require('./routes/productRouter'));
app.use('/api/auth', require('./routes/authRouter'));


// Routes
app.use('/users', userRouter);
app.use('/orders', orderRouter);
app.use('/products', productRouter)
app.use('/auth', authRouter);

app.use(authenticateUser); // Protect all routes
app.get('/profile', (req, res) => {
    res.json({ message: "This is a protected profile", user: req.user });
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
