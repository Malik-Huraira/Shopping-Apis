const db = require('../config/db');
const queries = require('../config/queries');

const createOrder = async (user_id, total_price, status = 'pending') => {
    status = status || 'pending'; 
    const [result] = await db.query(queries.INSERT_ORDER, [user_id, total_price, status]);
    return result.insertId;
};

const getOrderById = async (id) => {
    const [order] = await db.query(queries.GET_ORDER_BY_ID, [id]);
    return order.length ? order[0] : null;
};

const getUserOrders = async (user_id) => {
    const [orders] = await db.query(queries.GET_USER_ORDERS, [user_id]); 
    return orders;
};
const updateOrderStatus = async (id, status) => {
    const [result] = await db.query(queries.UPDATE_ORDER_STATUS, [status, id]);
    return result.affectedRows;
};

const deleteOrder = async (id) => {
    const [result] = await db.query(queries.DELETE_ORDER, [id]);
    return result.affectedRows;
};

module.exports = { createOrder, getOrderById, getUserOrders, updateOrderStatus, deleteOrder };
