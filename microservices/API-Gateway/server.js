// server.js
const fs = require('fs');
const https = require('https');
const app = require('./app');
const config = require('./config');
const { startWebSocketServer } = require("./websocket/websocketServer");

const { port } = config.app;
const { keyPath, certPath } = config.ssl;

const sslOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
};

https.createServer(sslOptions, app).listen(port, () => {
    console.log(`🔐 ${config.app.name} running securely on https://localhost:${port}`);
});

startWebSocketServer();