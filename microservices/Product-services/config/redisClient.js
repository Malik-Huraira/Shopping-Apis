const redis = require('redis');

const client = redis.createClient({
    legacyMode: true, // for Redis v4 compatibility with callbacks
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.connect().catch(console.error);

client.on('error', (err) => console.error('Redis Error:', err));
client.on('connect', () => console.log('Redis connected'));

module.exports = client;
