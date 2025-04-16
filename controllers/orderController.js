const orderModel = require("../models/orderModel");
const HTTP = require("../utils/httpStatusCodes");

// Create a new order
const createOrder = async (req, res) => {
    const { user_id, products } = req.body;

    if (!user_id || !Array.isArray(products) || products.length === 0) {
        return res.status(HTTP.BadRequest).json({ error: "User ID and products are required." });
    }

    try {
        const orderId = await orderModel.createOrder(user_id, products);
        res.status(HTTP.Created).json({ message: "Order created successfully", order_id: orderId });
    } catch (error) {
        console.error("Create Order Error:", error);
        res.status(HTTP.InternalServerError).json({ error: "Internal Server Error", details: error.message });
    }
};

// Get order by ID
const getOrderById = async (req, res) => {
    try {
        const order = await orderModel.getOrderById(req.params.id);

        if (!order) {
            return res.status(HTTP.NotFound).json({ error: "Order not found" });
        }

        res.status(HTTP.OK).json(order);
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

    try {
        const [orders, totalOrders] = await Promise.all([
            orderModel.getPaginatedUserOrders(user_id, limit, offset),
            orderModel.getTotalUserOrdersCount(user_id)
        ]);

        res.status(HTTP.OK).json({
            orders,
            currentPage: page,
            totalPages: Math.ceil(totalOrders / limit),
            totalOrders,
            limit
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
