const express = require('express');
const emailRouter = require('./routes/emailRouter');


const app = express();

// Middleware
app.use(express.json());

// Routers

app.use('/api/email', emailRouter);
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', service: 'Email Service' });
});


// Start HTTPS server
const PORT = 5002
app.listen(PORT, () => {
    console.log(`🔐 HTTPS server running at https://localhost:${PORT}`);
});

