// api-gateway/server.js
const fs = require('fs');
const https = require('https');
const app = require('./app');

const PORT = process.env.PORT || 5000;

const sslOptions = {
    key: fs.readFileSync('./ssl/server.key'),
    cert: fs.readFileSync('./ssl/server.cert')
};

// Start HTTPS Server
https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`🔐 API Gateway running securely on https://localhost:${PORT}`);
});
