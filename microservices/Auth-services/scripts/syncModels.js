const sequelize = require('../config/sequelize');
const User = require('../model/User');
const Role = require('../model/Role');
const Status = require('../model/Status');
const Session = require('../model/Session');

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');

        await sequelize.sync({ alter: true }); // Use { force: true } for full drop/recreate
        console.log('All models were synchronized successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
})();
