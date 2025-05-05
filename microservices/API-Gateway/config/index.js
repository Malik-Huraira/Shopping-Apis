const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

const env = (process.env.NODE_ENV || 'development').toLowerCase();
const envFile = `.env.${env}`;
const envPath = path.join(__dirname, '..', envFile);

// Step 1: Load environment variables
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log(`[CONFIG] Loaded environment variables from ${envFile}`);
} else {
    console.warn(`[CONFIG] No ${envFile} found. Falling back to defaults or system environment.`);
}

// Step 2: Load matching config file
let config;
try {
    config = require(`./environments/${env}`);
} catch (err) {
    console.error(`[CONFIG] Failed to load ./environments/${env}.js`);
    console.error(err.message);
    process.exit(1);
}

// Step 3: Attach runtime flags
config.env = env;
config.isProd = env === 'production';
config.isTest = env === 'testing';
config.isDev = env === 'development';
config.isStage = env === 'staging';

module.exports = config;
