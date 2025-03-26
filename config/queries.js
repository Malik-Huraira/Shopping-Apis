const queries = {
    // Users Queries
    GET_USER_BY_EMAIL: "SELECT * FROM users WHERE email = ?",
    GET_USER_BY_PHONE: "SELECT * FROM users WHERE phone_number = ?",
    INSERT_USER: "INSERT INTO users (name, email, password, phone_number, status, role, address, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    GET_ALL_USERS: "SELECT * FROM users",
    GET_USER_BY_ID: "SELECT * FROM users WHERE id = ?",
    UPDATE_USER: "UPDATE users SET name = ?, email = ?, phone_number = ?, status = ?, role = ?, address = ?, description = ? WHERE id = ?",
    DELETE_USER: "DELETE FROM users WHERE id = ?",
    INSERT_SESSION: "INSERT INTO sessions (user_id, token) VALUES (?, ?)",
    DELETE_SESSION: "DELETE FROM sessions WHERE token = ?",

    // Products Queries
    GET_ALL_PRODUCTS: "SELECT * FROM products",
    GET_PRODUCT_BY_ID: "SELECT * FROM products WHERE id = ?",
    INSERT_PRODUCT: "INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)",
    UPDATE_PRODUCT: "UPDATE products SET name = ?, description = ?, price = ?, stock = ? WHERE id = ?",
    DELETE_PRODUCT: "DELETE FROM products WHERE id = ?",

    // Orders Queries (Using Joins)
    GET_PRODUCT_PRICE: "SELECT price FROM products WHERE id = ?",
    INSERT_ORDER: "INSERT INTO orders (user_id, total_price) VALUES (?, ?)",
    INSERT_ORDER_ITEM: "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
    GET_ORDER_BY_ID: `
        SELECT o.id AS order_id, o.total_price, o.created_at, 
               u.name AS user_name, u.email AS user_email, 
               p.name AS product_name, oi.quantity, oi.price
        FROM orders o
        JOIN users u ON o.user_id = u.id
        JOIN order_items oi ON oi.order_id = o.id
        JOIN products p ON oi.product_id = p.id
        WHERE o.id = ?
    `,
    GET_USER_ORDERS: `
        SELECT o.id AS order_id, o.total_price, o.created_at, 
               p.name AS product_name, oi.quantity, oi.price
        FROM orders o
        JOIN order_items oi ON oi.order_id = o.id
        JOIN products p ON oi.product_id = p.id
        WHERE o.user_id = ?
    `,
    UPDATE_ORDER_STATUS: "UPDATE orders SET status = ? WHERE id = ?",
    DELETE_ORDER: "DELETE FROM orders WHERE id = ?",
};

module.exports = queries;

module.exports = queries;