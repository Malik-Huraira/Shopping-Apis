const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Role = sequelize.define('Role', {
    role_name: { type: DataTypes.STRING, allowNull: false }
}, {
    tableName: 'roles',
    timestamps: false
});

module.exports = Role;
