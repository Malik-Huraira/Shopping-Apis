const Order = require('./Order');
const OrderItem = require('./OrderItem');
const sequelize = require('../config/sequelize');

const createOrder = async (user_id, total_price, order_items) => {
    return await sequelize.transaction(async (t) => {

        console.log("Creating order for user:", user_id, "with total price:", total_price);
        const newOrder = await Order.create({
            user_id: parseInt(user_id),
            total_price: parseFloat(total_price),
            status: "pending" // default to "pending"
        }, { transaction: t });

        for (let product of order_items) {
            await OrderItem.create({
                order_id: newOrder.id,
                product_id: product.product_id,
                quantity: product.quantity,
                price: product.price
            }, { transaction: t });
        }

        return newOrder.id;
    });
};

// 🔹 Get Order by ID
const getOrderById = async (id) => {
    const order = await Order.findByPk(id, {
        include: [
            {
                model: OrderItem,
                include: [{ model: Product, attributes: ['id', 'name', 'price'] }]
            }
        ]
    });
    return order || null;
};

// 🔹 Get Orders by User
const getUserOrders = async (user_id) => {
    return await Order.findAll({
        where: { user_id },
        include: [
            {
                model: OrderItem,
                include: [{ model: Product, attributes: ['id', 'name', 'price'] }]
            }
        ],
        order: [['created_at', 'DESC']]
    });
};



const updateOrderStatus = async (id, status) => {
    if (!status) {
        throw new Error("Invalid status");
    }

    const [affectedRows] = await Order.update({ status: status }, {
        where: { id }
    });

    return affectedRows;
};

// 🔹 Delete Order
const deleteOrder = async (id) => {
    return await sequelize.transaction(async (t) => {
        await OrderItem.destroy({ where: { order_id: id }, transaction: t });
        const deleted = await Order.destroy({ where: { id }, transaction: t });
        return deleted;
    });
};

// 🔹 Paginated Orders
const getPaginatedUserOrders = async (user_id, limit, offset) => {
    return await Order.findAll({
        where: { user_id },
        include: [
            {
                model: OrderItem,
                include: [{ model: Product, attributes: ['name', 'price'] }]
            }
        ],
        order: [['created_at', 'DESC']],
        limit,
        offset
    });
};

// 🔹 Total Orders Count for User
const getTotalUserOrdersCount = async (user_id) => {
    return await Order.count({ where: { user_id } });
};

module.exports = {
    createOrder,
    getOrderById,
    getUserOrders,
    updateOrderStatus,
    deleteOrder,
    getPaginatedUserOrders,
    getTotalUserOrdersCount
};
