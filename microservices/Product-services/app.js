const cluster = require('cluster');
const os = require('os');
const express = require('express');

const totalCPUs = os.cpus().length;
if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);
    for (let i = 0; i < totalCPUs; i++) {
        cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
    });
}
else {
    const app = express();
    const PORT = process.env.PORT || 8000;

    app.get('/', (req, res) => {
        res.send(`Hello from worker ${process.pid}`);
    });

    app.listen(PORT, () => {
        console.log(`Worker ${process.pid} started on port ${PORT}`);
    });
}
