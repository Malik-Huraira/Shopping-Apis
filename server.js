const express = require('express');
const cors = require('cors');
const userRouter = require('./routes/userRouter');
const orderRouter = require('./routes/orderRouter');
const productRouter = require('./routes/productRouter')
const authRouter = require('./routes/authRouter');
const { authenticateUser } = require('./middleware/authmiddleware');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());

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
