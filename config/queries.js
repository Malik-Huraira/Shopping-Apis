const queries = {
   
    // Users Queries
    GET_USER_BY_EMAIL: "SELECT id, name, email, role, status FROM users WHERE email = ?",
    GET_USER_BY_PHONE: "SELECT id, name, email, role, status FROM users WHERE phone_number = ?",
    GET_USER_BY_ID: "SELECT id, name, email, phone_number, status, role, address, description FROM users WHERE id = ?",
    GET_ALL_USERS: "SELECT id, name, email, role, status FROM users",
    GET_PAGINATED_USERS: "SELECT id, name, email, role, status FROM users ORDER BY id ASC LIMIT ? OFFSET ?",
    GET_TOTAL_USERS_COUNT: "SELECT COUNT(*) AS total FROM users",
    INSERT_USER: "INSERT INTO users (name, email, password, phone_number, status, role, address, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    UPDATE_USER: "UPDATE users SET name = ?, email = ?, phone_number = ?, status = ?, role = ?, address = ?, description = ? WHERE id = ?",
    DELETE_USER: "DELETE FROM users WHERE id = ?",

    // Sessions Queries
    INSERT_SESSION: "INSERT INTO sessions (user_id, token) VALUES (?, ?)",
    DELETE_SESSION: "DELETE FROM sessions WHERE token = ?",

    // Products Queries
    GET_ALL_PRODUCTS: "SELECT id, name, price, stock FROM products",
    GET_PRODUCT_BY_ID: "SELECT id, name, description, price, stock FROM products WHERE id = ?",
    GET_PAGINATED_PRODUCTS: "SELECT id, name, price, stock FROM products ORDER BY id ASC LIMIT ? OFFSET ?",
    GET_TOTAL_PRODUCTS_COUNT: "SELECT COUNT(*) AS total FROM products",
    INSERT_PRODUCT: "INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)",
    UPDATE_PRODUCT: "UPDATE products SET name = ?, description = ?, price = ?, stock = ? WHERE id = ?",
    DELETE_PRODUCT: "DELETE FROM products WHERE id = ?",

    // Orders Queries
    GET_PRODUCT_PRICE: "SELECT price FROM products WHERE id = ?",
    INSERT_ORDER: "INSERT INTO orders (user_id, total_price) VALUES (?, ?)",
    INSERT_ORDER_ITEM: "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",

    GET_ORDER_BY_ID: `
        SELECT 
            o.id AS order_id, o.total_price, o.created_at, 
            u.name AS user_name, u.email AS user_email, 
            p.name AS product_name, oi.quantity, oi.price
        FROM orders o
        JOIN users u ON o.user_id = u.id
        JOIN order_items oi ON oi.order_id = o.id
        JOIN products p ON oi.product_id = p.id
        WHERE o.id = ?
    `,

    GET_USER_ORDERS: `
        SELECT 
            o.id AS order_id, o.total_price, o.created_at, 
            p.name AS product_name, oi.quantity, oi.price
        FROM orders o
        JOIN order_items oi ON oi.order_id = o.id
        JOIN products p ON oi.product_id = p.id
        WHERE o.user_id = ?
    `,

    GET_PAGINATED_USER_ORDERS: `
        SELECT id, total_price, created_at, status
        FROM orders
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
    `,

    GET_TOTAL_USER_ORDERS_COUNT: "SELECT COUNT(*) AS total FROM orders WHERE user_id = ?",
    UPDATE_ORDER_STATUS: "UPDATE orders SET status = ? WHERE id = ?",
    DELETE_ORDER: "DELETE FROM orders WHERE id = ?"
};

module.exports = queries;
