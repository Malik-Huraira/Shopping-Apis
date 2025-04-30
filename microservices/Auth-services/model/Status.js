const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Status = sequelize.define('Status', {
    status_name: { type: DataTypes.STRING, allowNull: false }
}, {
    tableName: 'statuses',
    timestamps: false
});

module.exports = Status;
