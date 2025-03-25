const db = require('../config/db');


const createOrder = async (req, res) => {
    try {
        const { user_id, products } = req.body; 

        if (!user_id || !products || products.length === 0) {
            return res.status(400).json({ error: "User ID and products are required" });
        }

        let total_price = 0;
        const productPrices = {}; 

        for (let product of products) {
            const [productData] = await db.query('SELECT price FROM products WHERE id = ?', [product.product_id]);
            if (productData.length === 0) {
                return res.status(404).json({ error: `Product ID ${product.product_id} not found` });
            }
            const productPrice = productData[0].price;
            productPrices[product.product_id] = productPrice;
            total_price += productPrice * product.quantity;
        }
        const [orderResult] = await db.query('INSERT INTO orders (user_id, total_price) VALUES (?, ?)', [user_id, total_price]);
        const orderId = orderResult.insertId;
s
        for (let product of products) {
            await db.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, product.product_id, product.quantity, productPrices[product.product_id]]
            );
        }

        res.status(201).json({ message: "Order created successfully", order_id: orderId });
    } catch (err) {
        console.error("Error creating order:", err);
        res.status(500).json({ error: "Database error", details: err.message });
    }
};

const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const [order] = await db.query('SELECT * FROM orders WHERE id = ?', [id]);
        if (order.length === 0) {
            return res.status(404).json({ error: "Order not found" });
        }
        const [items] = await db.query(
            `SELECT oi.product_id, p.name, oi.quantity, oi.price 
             FROM order_items oi 
             JOIN products p ON oi.product_id = p.id 
             WHERE oi.order_id = ?`,
            [id]
        );

        res.status(200).json({ order: order[0], items });
    } catch (err) {
        console.error("Error fetching order:", err);
        res.status(500).json({ error: "Database error", details: err.message });
    }
};


const getUserOrders = async (req, res) => {
    try {
        const user_id = parseInt(req.query.user_id, 10);

        if (isNaN(user_id)) {
            return res.status(400).json({ error: "Valid User ID is required" });
        }

        const [orders] = await db.query('SELECT * FROM orders WHERE user_id = ?', [user_id]);

        res.status(200).json(orders);
    } catch (err) {
        console.error("Error fetching user orders:", err);
        res.status(500).json({ error: "Database error", details: err.message });
    }
};


const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ["pending", "shipped", "delivered", "cancelled"];
        if (!status || !validStatuses.includes(status.toLowerCase())) {
            return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(", ")}` });
        }

        const [result] = await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.status(200).json({ message: "Order status updated successfully" });
    } catch (err) {
        console.error("Error updating order status:", err);
        res.status(500).json({ error: "Database error", details: err.message });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query('DELETE FROM orders WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.status(200).json({ message: "Order deleted successfully" });
    } catch (err) {
        console.error("Error deleting order:", err);
        res.status(500).json({ error: "Database error", details: err.message });
    }
};

module.exports = { createOrder, getOrderById, getUserOrders, updateOrderStatus, deleteOrder };
