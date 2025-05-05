const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Determine current environment
const env = process.env.NODE_ENV || 'development';

// Load environment variables from .env file
const envPath = path.join(__dirname, '..', `.env.${env}`);
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
} else {
    console.warn(`No .env file found for ${env} environment`);
}

// Load environment-specific config
let config;
try {
    config = require(`./environments/${env}`);
} catch (err) {
    console.error(`Failed to load ${env} config:`, err.message);
    process.exit(1);
}

// Add common configuration that doesn't change between environments
config.env = env;
config.isProd = env === 'production';
config.isTest = env === 'testing';
config.isDev = env === 'development';
config.isStage = env === 'staging';

module.exports = config;