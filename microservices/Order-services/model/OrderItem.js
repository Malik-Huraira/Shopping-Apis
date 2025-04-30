const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Order = require('./Order');

class OrderItem extends Model { }
OrderItem.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    order_id: { type: DataTypes.INTEGER, allowNull: false },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false }
}, {
    sequelize,
    modelName: 'OrderItem',
    tableName: 'order_items',
    timestamps: false
});

// OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

module.exports = OrderItem;
