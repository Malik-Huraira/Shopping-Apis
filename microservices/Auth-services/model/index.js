const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

// Import models
const Role = require('./Role');
const Status = require('./Status');
const User = require('./User');
const Session = require('./Session');

// Set up associations again if needed
User.belongsTo(Role, { foreignKey: 'role_id' });
User.belongsTo(Status, { foreignKey: 'status_id' });
Session.belongsTo(User, { foreignKey: 'user_id' });

const db = {
    sequelize,
    Sequelize,
    Role,
    Status,
    User,
    Session
};

module.exports = db;
  