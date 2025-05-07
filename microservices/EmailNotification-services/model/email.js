// emailModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); // Path to your sequelize config

const Email = sequelize.define('Email', {
    recipient: { type: DataTypes.STRING, allowNull: false },
    subject: { type: DataTypes.STRING, allowNull: false },
    body: { type: DataTypes.TEXT, allowNull: false },
    status: {
        type: DataTypes.ENUM('pending', 'sent', 'failed'),
        defaultValue: 'pending',
    },
    retryCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
}, {
    tableName: 'emails',
    timestamps: true,
});

module.exports = Email; // Export the model as default
