const orderModel = require("../models/orderModel");
const HTTP = require("../utils/httpStatusCodes");
const { getCache, setCache, clearOrderCache } = require("../utils/cacheUtils");

// Create a new order
const createOrder = async (req, res) => {
    const { user_id, products } = req.body;

    if (!user_id || !Array.isArray(products) || products.length === 0) {
        return res.status(HTTP.BadRequest).json({ error: "User ID and products are required." });
    }

    try {
        const orderId = await orderModel.createOrder(user_id, products);
        clearOrderCache(user_id);
        res.status(HTTP.Created).json({ message: "Order created successfully", order_id: orderId });
    } catch (error) {
        console.error("Create Order Error:", error);
        res.status(HTTP.InternalServerError).json({ error: "Internal Server Error", details: error.message });
    }
};

// Get order by ID
const getOrderById = async (req, res) => {
    const id = req.params.id;
    const cacheKey = `order:${id}`;

    try {
        getCache(cacheKey, async (err, cachedData) => {
            if (err) throw err;
            if (cachedData) return res.status(HTTP.OK).json(cachedData);

            const order = await orderModel.getOrderById(id);
            if (!order) {
                return res.status(HTTP.NotFound).json({ error: "Order not found" });
            }

            setCache(cacheKey, order);
            res.status(HTTP.OK).json(order);
        });
    } catch (error) {
        console.error("Get Order By ID Error:", error);
        res.status(HTTP.InternalServerError).json({ error: "Internal Server Error", details: error.message });
    }
};


// Get paginated orders for a user
const getUserOrders = async (req, res) => {
    const user_id = req.params.userId;
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    const cacheKey = `order:user:${user_id}:page:${page}:limit:${limit}`;

    try {
        getCache(cacheKey, async (err, cachedData) => {
            if (err) throw err;
            if (cachedData) return res.status(HTTP.OK).json(cachedData);

            const [orders, totalOrders] = await Promise.all([
                orderModel.getPaginatedUserOrders(user_id, limit, offset),
                orderModel.getTotalUserOrdersCount(user_id)
            ]);

            const response = {
                orders,
                currentPage: page,
                totalPages: Math.ceil(totalOrders / limit),
                totalOrders,
                limit
            };

            setCache(cacheKey, response);
            res.status(HTTP.OK).json(response);
        });
    } catch (error) {
        console.error("Get User Orders Error:", error);
        res.status(HTTP.InternalServerError).json({ error: "Internal Server Error", details: error.message });
    }
};


// Update order status
const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(HTTP.BadRequest).json({ error: "Status is required" });
    }

    try {
        const updatedRows = await orderModel.updateOrderStatus(id, status);

        if (updatedRows === 0) {
            return res.status(HTTP.NotFound).json({ error: "Order not found" });
        }

        clearOrderCache(null, id); 
        res.status(HTTP.OK).json({ message: "Order status updated successfully" });
    } catch (error) {
        console.error("Update Order Status Error:", error);
        res.status(HTTP.InternalServerError).json({ error: "Internal Server Error", details: error.message });
    }
};


// Delete an order
const deleteOrder = async (req, res) => {
    try {
        const deletedRows = await orderModel.deleteOrder(req.params.id);

        if (deletedRows === 0) {
            return res.status(HTTP.NotFound).json({ error: "Order not found" });
        }

        clearOrderCache(null, req.params.id);
        res.status(HTTP.OK).json({ message: "Order deleted successfully" });
    } catch (error) {
        console.error("Delete Order Error:", error);
        res.status(HTTP.InternalServerError).json({ error: "Internal Server Error", details: error.message });
    }
};

module.exports = {
    createOrder,
    getOrderById,
    getUserOrders,
    updateOrderStatus,
    deleteOrder
};
