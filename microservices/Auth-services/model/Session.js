const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Sequelize = require('sequelize');
const User = require('./User');

const Session = sequelize.define('Session', {
    token: { type: DataTypes.STRING, allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    expiresAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('DATE_ADD(NOW(), INTERVAL 1 HOUR)') }
}, {
    tableName: 'sessions',
    timestamps: false
});


module.exports = Session;
