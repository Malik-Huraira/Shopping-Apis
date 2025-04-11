const orderModel = require("../models/orderModel");
const HTTP = require("../utils/httpStatusCodes");

const createOrder = async (req, res) => {
    try {
        const { user_id, products } = req.body;

        if (!user_id || !products || products.length === 0) {
            return res.status(HTTP.BadRequest).json({ error: "User ID and products are required" });
        }

        const orderId = await orderModel.createOrder(user_id, products);

        res.status(HTTP.Created).json({ message: "Order created successfully", order_id: orderId });
    } catch (error) {
        console.error("Create Order Error:", error);
        res.status(HTTP.InternalServerError).json({ error: "Internal Server Error", details: error.message });
    }
};

const getOrderById = async (req, res) => {
    try {
        const orderData = await orderModel.getOrderById(req.params.id);

        if (!orderData) {
            return res.status(HTTP.NotFound).json({ error: "Order not found" });
        }

        res.status(HTTP.OK).json(orderData);
    } catch (error) {
        console.error("Get Order By ID Error:", error);
        res.status(HTTP.InternalServerError).json({ error: "Internal Server Error", details: error.message });
    }
};

const getUserOrders = async (req, res) => {
    try {
        let { page, limit } = req.query;
        const user_id = req.params.userId;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const offset = (page - 1) * limit;

        const orders = await orderModel.getPaginatedUserOrders(user_id, limit, offset);
        const totalOrders = await orderModel.getTotalUserOrdersCount(user_id);

        res.status(HTTP.OK).json({
            orders,
            currentPage: page,
            totalPages: Math.ceil(totalOrders / limit),
            totalOrders,
            limit,
        });

    } catch (error) {
        console.error("Get User Orders Error:", error);
        res.status(HTTP.InternalServerError).json({ error: "Internal Server Error", details: error.message });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

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
