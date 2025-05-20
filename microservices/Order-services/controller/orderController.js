const Order = require('../model/Order');
const OrderItem = require('../model/OrderItem');
const User = require('../../Auth-services/model/User');
const HTTP = require("../utils/httpStatusCodes");
const { getCache, setCache, clearOrderCache } = require("../utils/cacheUtils");
const { publishOrderCreated } = require('../RabbitMq/Producer');
const { Op } = require("sequelize");
const axios = require('axios');
require('dotenv').config();
const orderModel = require('../model/orderModel');

const createOrder = async (req, res) => {
    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
        return res.status(HTTP.BadRequest).json({ error: "User ID and at least one product are required." });
    }

    try {
        const productIds = products.map(p => p.product_id);

        const { data: productData } = await axios.post(
            `${process.env.PRODUCT_SERVICE_URL}/api/products/bulk`,
            { ids: productIds },
            {
                headers: {
                    Authorization: `Bearer ${req.headers.authorization}`,
                }
            }
        );

        if (!productData || productData.length !== productIds.length) {
            return res.status(HTTP.BadRequest).json({ error: "One or more products not found." });
        }

        let total_price = 0;
        const items = [];

        for (let p of products) {
            const product = productData.find(prod => prod.id === p.product_id);
            if (!product) {
                return res.status(HTTP.BadRequest).json({ error: `Product ID ${p.product_id} not found.` });
            }

            const itemTotal = parseFloat(product.price) * p.quantity;
            total_price += itemTotal;

            items.push({
                product_id: product.id,
                name: product.name,
                description: product.description,
                quantity: p.quantity,
                price: parseFloat(product.price)
            });
        }

        // Create order
        const order = await orderModel.createOrder(
            req.user.id,
            total_price,
            items
        );
        console.log('Order created:', order);

        await clearOrderCache(req.user.id);

        // Fetch user email and name from req.user (adjust according to your auth system)
        const user_email = req.user.email;  // Make sure req.user.email exists
        const user_name = req.user.username;  // fallback to 'Customer' if name missing

        console.log('Publishing order_created event with:', { order_id: order, user_email, user_name });
        try {
            await publishOrderCreated({
                order_id: order,
                user_id: req.user.id,
                user_email,
                user_name,
                total_price,
                items,
            });
        } catch (err) {
            console.error('❌ Failed to publish order_created event:', err);
        }
        console.log('User info:', req.user);
        return res.status(HTTP.Created).json({
            message: "Order created successfully",
            order_id: order.id
        });

    } catch (error) {
        console.error("❌ Create Order Error:", error);
        return res.status(HTTP.InternalServerError).json({
            error: "Failed to create order",
            details: error.message
        });
    }
};


// Get order by ID (with items)
const getOrderById = async (req, res) => {
    const id = req.params.id;
    const cacheKey = `order:${id}`;

    try {
        const cachedData = await getCache(cacheKey);
        if (cachedData) return res.status(HTTP.OK).json(JSON.parse(cachedData));

        const order = await Order.findByPk(id);

        if (!order) {
            return res.status(HTTP.NotFound).json({ error: "Order not found" });
        }

        setCache(cacheKey, JSON.stringify(order));
        return res.status(HTTP.OK).json(order);
    } catch (error) {
        console.error("❌ Get Order By ID Error:", error);
        return res.status(HTTP.InternalServerError).json({ error: "Failed to fetch order", details: error.message });
    }
}

// Get paginated orders for a user
const getUserOrders = async (req, res) => {
    const user_id = req.params.userId;
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    const cacheKey = `order:user:${user_id}:page:${page}:limit:${limit}`;

    try {
        const cachedData = await getCache(cacheKey);
        if (cachedData) {
            return res.status(HTTP.OK).json(JSON.parse(cachedData));  // Parse before returning
        }

        const { rows: orders, count: totalOrders } = await Order.findAndCountAll({
            where: { user_id },
            limit,
            offset,
            order: [["created_at", "DESC"]]  // Make sure column name matches model definition
        });

        const response = {
            orders,
            currentPage: page,
            totalPages: Math.ceil(totalOrders / limit),
            totalOrders,
            limit
        };

        await setCache(cacheKey, JSON.stringify(response));
        return res.status(HTTP.OK).json(response);

    } catch (error) {
        console.error("❌ Get User Orders Error:", error);
        return res.status(HTTP.InternalServerError).json({
            error: "Failed to fetch user orders",
            details: error.message
        });
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
        const [updatedRows] = await Order.update({ status }, { where: { id } });

        if (updatedRows === 0) {
            return res.status(HTTP.NotFound).json({ error: "Order not found" });
        }

        await clearOrderCache(null, id);
        return res.status(HTTP.OK).json({ message: "Order status updated successfully" });
    } catch (error) {
        console.error("❌ Update Order Status Error:", error);
        return res.status(HTTP.InternalServerError).json({ error: "Failed to update order status", details: error.message });
    }
};

// Delete an order
const deleteOrder = async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await Order.destroy({ where: { id } });

        if (deleted === 0) {
            return res.status(HTTP.NotFound).json({ error: "Order not found" });
        }

        await clearOrderCache(null, id);
        return res.status(HTTP.OK).json({ message: "Order deleted successfully" });
    } catch (error) {
        console.error("❌ Delete Order Error:", error);
        return res.status(HTTP.InternalServerError).json({ error: "Failed to delete order", details: error.message });
    }
};

module.exports = {
    createOrder,
    getOrderById,
    getUserOrders,
    updateOrderStatus,
    deleteOrder
};
