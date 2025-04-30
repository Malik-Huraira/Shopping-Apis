const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Role = require('./Role');
const Status = require('./Status');

const User = sequelize.define('User', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.TEXT, allowNull: false },
    phone_number: { type: DataTypes.STRING(20), unique: true },
    address: { type: DataTypes.TEXT },
    description: { type: DataTypes.TEXT },
    role_id: { type: DataTypes.INTEGER, allowNull: false },
    status_id: { type: DataTypes.INTEGER, allowNull: false },
}, {
    tableName: 'users',
    timestamps: false,
});

User.belongsTo(Role, { foreignKey: 'role_id' });
User.belongsTo(Status, { foreignKey: 'status_id' });

module.exports = User;
