const orderModel = require("../models/orderModel"); // Importing model

const createOrder = async (req, res) => {
    try {
        const { user_id, products } = req.body;

        if (!user_id || !products || products.length === 0) {
            return res.status(400).json({ error: "User ID and products are required" });
        }

        const orderId = await orderModel.createOrder(user_id, products);

        res.status(201).json({ message: "Order created successfully", order_id: orderId });
    } catch (error) {
        console.error("Create Order Error:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

const getOrderById = async (req, res) => {
    try {
        const orderData = await orderModel.getOrderById(req.params.id);

        if (!orderData) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.status(200).json(orderData);
    } catch (error) {
        console.error("Get Order By ID Error:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const user_id = parseInt(req.query.user_id, 10);

        if (isNaN(user_id)) {
            return res.status(400).json({ error: "Valid User ID is required" });
        }

        const orders = await orderModel.getUserOrders(user_id);

        res.status(200).json(orders);
    } catch (error) {
        console.error("Get User Orders Error:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedRows = await orderModel.updateOrderStatus(id, status);

        if (updatedRows === 0) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.status(200).json({ message: "Order status updated successfully" });
    } catch (error) {
        console.error("Update Order Status Error:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const deletedRows = await orderModel.deleteOrder(req.params.id);

        if (deletedRows === 0) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
        console.error("Delete Order Error:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

module.exports = { createOrder, getOrderById, getUserOrders, updateOrderStatus, deleteOrder };
