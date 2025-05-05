const { Sequelize } = require('sequelize');
const config = require('./index');
require('dotenv').config(); 
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: config.db.host,
    port: config.db.port,
    dialect: 'mysql',
    logging: config.isDev ? console.log : false,
    pool: {
        max: config.isProd ? 10 : 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}
);

// Test the connection
sequelize.authenticate()
    .then(() => {
        console.log(`${config.app.name} database connection established successfully.`);
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
        process.exit(1);
    });

module.exports = sequelize;