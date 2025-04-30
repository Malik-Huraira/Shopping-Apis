const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const User = require('./User');

const Session = sequelize.define('Session', {
    token: { type: DataTypes.STRING, allowNull: false }
}, {
    tableName: 'sessions',
    timestamps: false
});

Session.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Session;
