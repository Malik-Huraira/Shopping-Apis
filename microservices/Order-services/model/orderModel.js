const db = require('../config/db');
const queries = require('../config/queries');

// Create an order
// Create an order
const createOrder = async (user_id, products) => {
    let total_price = 0;
    const productPrices = {};

    // ✅ Check if user exists
    const [userRows] = await db.query("SELECT id FROM users WHERE id = ?", [user_id]);
    if (!userRows.length) {
        throw new Error(`User ID ${user_id} does not exist`);
    }

    // 🧮 Get price for each product and calculate total
    for (let product of products) {
        const [productData] = await db.query("CALL GetProductPrice(?)", [product.product_id]);

        if (!productData || !productData[0] || !productData[0][0]) {
            throw new Error(`Product ID ${product.product_id} not found`);
        }

        const productPrice = productData[0][0].price;
        productPrices[product.product_id] = productPrice;
        total_price += productPrice * product.quantity;
    }

    // 📝 Insert the order
    const [orderResult] = await db.query("CALL InsertOrder(?, ?)", [user_id, total_price]);

    // 🆔 Extract inserted order ID
    const orderId = orderResult[0][0]?.inserted_id || orderResult.insertId;

    // 📦 Insert each product in the order_items table
    for (let product of products) {
        await db.query("CALL InsertOrderItem(?, ?, ?, ?)", [
            orderId,
            product.product_id,
            product.quantity,
            productPrices[product.product_id]
        ]);
    }

    return orderId;
};


// Get order by ID
const getOrderById = async (id) => {
    const [order] = await db.query("CALL GetOrderById(?)", [id]);
    return order.length ? order : null;
};

// Get orders for a specific user
const getUserOrders = async (user_id) => {
    const [orders] = await db.query("CALL GetUserOrders(?)", [user_id]);
    return orders;
};

// Update order status
const statusMap = {
    pending: 1,
    shipped: 2,
    delivered: 3,
    cancelled: 4,
};

const updateOrderStatus = async (id, status) => {
    const statusId = statusMap[status.toLowerCase()];
    if (!statusId) {
        throw new Error("Invalid status");
    }

    const [result] = await db.query("CALL UpdateOrderStatus(?, ?)", [id, statusId]);
    return result.affectedRows;
};

// Delete an order
const deleteOrder = async (id) => {
    const [result] = await db.query("CALL DeleteOrder(?)", [id]);
    return result.affectedRows;
};

// Get paginated orders for a user
const getPaginatedUserOrders = async (user_id, limit, offset) => {
    const [orders] = await db.query("CALL GetPaginatedUserOrders(?, ?, ?)", [user_id, limit, offset]);
    return orders;
};

// Get total order count for a user
const getTotalUserOrdersCount = async (user_id) => {
    const [result] = await db.query("CALL GetTotalUserOrdersCount(?)", [user_id]);
    return result[0].total;
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
