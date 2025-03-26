const db = require("../config/db");
const queries = require("../config/queries");

const createOrder = async (user_id, products) => {
    let total_price = 0;
    const productPrices = {};

    for (let product of products) {
        const [productData] = await db.query(queries.GET_PRODUCT_PRICE, [product.product_id]);
        if (productData.length === 0) throw new Error(`Product ID ${product.product_id} not found`);

        const productPrice = productData[0].price;
        productPrices[product.product_id] = productPrice;
        total_price += productPrice * product.quantity;
    }

    const [orderResult] = await db.query(queries.INSERT_ORDER, [user_id, total_price]);
    const orderId = orderResult.insertId;

    for (let product of products) {
        await db.query(queries.INSERT_ORDER_ITEM, [orderId, product.product_id, product.quantity, productPrices[product.product_id]]);
    }

    return orderId;
};

const getOrderById = async (id) => {
    const [order] = await db.query(queries.GET_ORDER_BY_ID, [id]);
    return order.length ? order : null;
};

const getUserOrders = async (user_id) => {
    const [orders] = await db.query(queries.GET_USER_ORDERS, [user_id]);
    return orders;
};

const updateOrderStatus = async (id, status) => {
    const validStatuses = ["pending", "shipped", "delivered", "cancelled"];
    if (!status || !validStatuses.includes(status.toLowerCase())) {
        throw new Error(`Invalid status. Allowed values: ${validStatuses.join(", ")}`);
    }

    const [result] = await db.query(queries.UPDATE_ORDER_STATUS, [status, id]);
    return result.affectedRows;
};

const deleteOrder = async (id) => {
    const [result] = await db.query(queries.DELETE_ORDER, [id]);
    return result.affectedRows;
};

module.exports = { createOrder, getOrderById, getUserOrders, updateOrderStatus, deleteOrder };
