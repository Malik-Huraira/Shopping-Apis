const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Fix 1: Handle case where NODE_ENV might be undefined
const env = (process.env.NODE_ENV || 'development').toLowerCase(); // Ensure lowercase

// Fix 2: More robust .env file loading
const envDir = path.join(__dirname, '..');
const envPath = path.join(envDir, `.env.${env}`);

if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
} else if (env === 'development') {
    // Special handling for development as it's commonly used
    
    const defaultEnvPath = path.join(envDir, '.env');
    if (fs.existsSync(defaultEnvPath)) {
        dotenv.config({ path: defaultEnvPath });
    } else {
        console.warn(`No .env file found for ${env} environment at ${envPath}`);
    }
}

// Fix 3: Better error handling for config loading
let config;
try {

    config = require(`./environments/${env}`);

    // Fix 4: Set environment flags
    config.env = env;
    config.isProd = env === 'production';
    config.isTest = env === 'testing';
    config.isDev = !config.isProd && !config.isTest;

    // Fix 5: Default values if config loading was partial
    config.db = config.db || {};
    config.app = config.app || {};
    config.jwt = config.jwt || {};

} catch (err) {
    console.error(`Failed to load ${env} config:`, err);

    // Provide more helpful error message
    if (err.code === 'MODULE_NOT_FOUND') {
        console.error(`Please create config/environments/${env}.js`);
    }
    process.exit(1);
}

module.exports = config;