module.exports = {
    // User Queries
    GET_ALL_USERS: `SELECT * FROM users`,
    GET_USER_BY_ID: `SELECT * FROM users WHERE id = ?`,
    INSERT_USER: `INSERT INTO users (name, email, password, phone_number, status, role, address, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    UPDATE_USER: `UPDATE users SET name=?, email=?, phone_number=?, status=?, role=?, address=?, description=? WHERE id=?`,
    DELETE_USER: `DELETE FROM users WHERE id = ?`,

    // Product Queries
    GET_ALL_PRODUCTS: "SELECT * FROM products",
    GET_PRODUCT_BY_ID: "SELECT * FROM products WHERE id = ?",
    INSERT_PRODUCT: "INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)",
    UPDATE_PRODUCT: "UPDATE products SET name=?, description=?, price=?, stock=? WHERE id=?",
    DELETE_PRODUCT: "DELETE FROM products WHERE id = ?",

    // Order Queries
    INSERT_ORDER: 'INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, ?)',
    GET_ORDER_BY_ID: 'SELECT * FROM orders WHERE id = ?',
    GET_USER_ORDERS: 'SELECT * FROM orders WHERE user_id = ?',
    UPDATE_ORDER_STATUS: 'UPDATE orders SET status = ? WHERE id = ?',
    DELETE_ORDER: 'DELETE FROM orders WHERE id = ?',

    // Authentication Queries
    GET_USER_BY_EMAIL: "SELECT * FROM users WHERE email = ?",
    INSERT_SESSION: `INSERT INTO sessions (user_id, token) VALUES (?, ?)`,

    // Session Management
    GET_SESSION: "SELECT * FROM sessions WHERE token = ? AND expires_at > NOW()",
    DELETE_SESSION: "DELETE FROM sessions WHERE token = ?"
};

