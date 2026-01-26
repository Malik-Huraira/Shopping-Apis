const redis = require("redis");
const { logger } = require("../utils/logger");

const redisHost = process.env.REDIS_HOST || "redis_cache";
const redisPort = parseInt(process.env.REDIS_PORT || 6379);

const client = redis.createClient({
  legacyMode: true,
  socket: {
    host: redisHost,
    port: redisPort,
    family: 4, // Force IPv4
  },
});

client.connect().catch(console.error);

client.on("error", (err) => logger.error("Redis Error:", err));
client.on("connect", () => logger.info("Redis connected"));

module.exports = client;
