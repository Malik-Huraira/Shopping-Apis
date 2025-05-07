const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const OrderItem = require('./OrderItem');
class Order extends Model { }
Order.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    total_price: { type: DataTypes.FLOAT, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false },
    createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
        defaultValue: DataTypes.NOW
    },
    updatedAt: { type: DataTypes.DATE }
}, {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
    timestamps: true
});



module.exports = Order;