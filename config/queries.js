const queries = {
    // User Queries
    GET_USER_BY_EMAIL: "SELECT * FROM users WHERE email = ?",
    GET_USER_BY_PHONE: "SELECT * FROM users WHERE phone_number = ?",
    GET_USER_BY_ID: "SELECT * FROM users WHERE id = ?",
    GET_ALL_USERS: "SELECT * FROM users",
    INSERT_USER: "INSERT INTO users (name, email, password, phone_number, status, role, address, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    UPDATE_USER: "UPDATE users SET name = ?, email = ?, phone_number = ?, status = ?, role = ?, address = ?, description = ? WHERE id = ?",
    DELETE_USER: "DELETE FROM users WHERE id = ?",
    INSERT_SESSION: "INSERT INTO sessions (user_id, token) VALUES (?, ?)",
    DELETE_SESSION: "DELETE FROM sessions WHERE token = ?",

    // Product Queries
    GET_ALL_PRODUCTS: "SELECT * FROM products",
    GET_PRODUCT_BY_ID: "SELECT * FROM products WHERE id = ?",
    GET_PRODUCT_PRICE: "SELECT price FROM products WHERE id = ?",
    INSERT_PRODUCT: "INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)",
    UPDATE_PRODUCT: "UPDATE products SET name = ?, description = ?, price = ?, stock = ? WHERE id = ?",
    DELETE_PRODUCT: "DELETE FROM products WHERE id = ?",

    // Order Queries
    INSERT_ORDER: "INSERT INTO orders (user_id, total_price) VALUES (?, ?)",
    INSERT_ORDER_ITEM: "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
    GET_ORDER_BY_ID: "SELECT * FROM orders WHERE id = ?",
    GET_ORDER_ITEMS: "SELECT * FROM order_items WHERE order_id = ?",
    GET_USER_ORDERS: "SELECT * FROM orders WHERE user_id = ?",
    UPDATE_ORDER_STATUS: "UPDATE orders SET status = ? WHERE id = ?",
    DELETE_ORDER: "DELETE FROM orders WHERE id = ?"
};

module.exports = queries;