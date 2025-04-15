-- 1. USERS TABLE (users)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    phone_number VARCHAR(20),
    role_id INT,
    status_id INT,
    address TEXT,
    description TEXT,
    password TEXT, -- Added password directly here
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (status_id) REFERENCES statuses(id)
);

-- 2. ROLES TABLE (roles)
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50)
);

-- 3. STATUSES TABLE (statuses)
CREATE TABLE statuses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    status_name VARCHAR(50)
);

-- 4. ORDERS TABLE (orders)
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    total_price DECIMAL(10, 2),
    status_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (status_id) REFERENCES statuses(id)
);

-- 5. PRODUCTS TABLE (products)
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    price DECIMAL(10, 2),
    stock INT
);

-- 6. ORDER ITEMS TABLE (order_items)
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 7. SESSIONS TABLE (sessions)
CREATE TABLE sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    token VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- =====================
-- PROCEDURES SECTION
-- =====================

-- USERS PROCEDURES

-- Get User by Email
DROP PROCEDURE IF EXISTS GetUserByEmail;
CREATE PROCEDURE GetUserByEmail(IN userEmail VARCHAR(255)) 
BEGIN
    SELECT u.id,
           u.name,
           u.email,
           r.role_name,
           u.password,
           s.status_name
    FROM users u
    JOIN roles r ON u.role_id = r.id
    JOIN statuses s ON u.status_id = s.id
    WHERE u.email = userEmail;
END;

-- Get User by Phone
DROP PROCEDURE IF EXISTS GetUserByPhone;
CREATE PROCEDURE GetUserByPhone(IN userPhone VARCHAR(20)) 
BEGIN
    SELECT u.id,
           u.name,
           u.email,
           r.role_name,
           s.status_name
    FROM users u
    JOIN roles r ON u.role_id = r.id
    JOIN statuses s ON u.status_id = s.id
    WHERE u.phone_number = userPhone;
END;

-- Get User by ID
DROP PROCEDURE IF EXISTS GetUserById;
CREATE PROCEDURE GetUserById(IN userId INT) 
BEGIN
    SELECT u.id,
           u.name,
           u.email,
           u.phone_number,
           r.role_name,
           s.status_name,
           u.address,
           u.description
    FROM users u
    JOIN roles r ON u.role_id = r.id
    JOIN statuses s ON u.status_id = s.id
    WHERE u.id = userId;
END;

-- Insert New User
DROP PROCEDURE IF EXISTS InsertUser;
CREATE PROCEDURE InsertUser(
    IN p_name VARCHAR(255),
    IN p_email VARCHAR(255),
    IN p_password TEXT,
    IN p_phone VARCHAR(20),
    IN p_role_id INT,
    IN p_status_id INT,
    IN p_address TEXT,
    IN p_description TEXT
) 
BEGIN
    INSERT INTO users (name, email, password, phone_number, role_id, status_id, address, description)
    VALUES (p_name, p_email, p_password, p_phone, p_role_id, p_status_id, p_address, p_description);
END;

-- Update User
DROP PROCEDURE IF EXISTS UpdateUser;
CREATE PROCEDURE UpdateUser(
    IN userId INT,
    IN p_name VARCHAR(255),
    IN p_email VARCHAR(255),
    IN p_phone VARCHAR(20),
    IN p_role_id INT,
    IN p_status_id INT,
    IN p_address TEXT,
    IN p_description TEXT
)
BEGIN
    UPDATE users
    SET name = p_name,
        email = p_email,
        phone_number = p_phone,
        role_id = p_role_id,
        status_id = p_status_id,
        address = p_address,
        description = p_description
    WHERE id = userId;
END;

-- Delete User
DROP PROCEDURE IF EXISTS DeleteUser;
CREATE PROCEDURE DeleteUser(IN userId INT) 
BEGIN
    DELETE FROM users WHERE id = userId;
END;

-- ROLES & STATUSES PROCEDURES

-- Insert Role
DROP PROCEDURE IF EXISTS InsertRole;
CREATE PROCEDURE InsertRole(IN p_role_name VARCHAR(50)) 
BEGIN
    INSERT INTO roles (role_name)
    VALUES (p_role_name);
END;

-- Insert Status
DROP PROCEDURE IF EXISTS InsertStatus;
CREATE PROCEDURE InsertStatus(IN p_status_name VARCHAR(50)) 
BEGIN
    INSERT INTO statuses (status_name)
    VALUES (p_status_name);
END;

-- ORDERS PROCEDURES

-- Create Order
DROP PROCEDURE IF EXISTS CreateOrder;
CREATE PROCEDURE CreateOrder(
    IN p_user_id INT,
    IN p_total DECIMAL(10, 2),
    IN p_status_id INT
) 
BEGIN
    INSERT INTO orders (user_id, total_price, status_id, created_at)
    VALUES (p_user_id, p_total, p_status_id, NOW());
    SELECT LAST_INSERT_ID() AS order_id;
END;

-- Update Order Status
DROP PROCEDURE IF EXISTS UpdateOrderStatus;
CREATE PROCEDURE UpdateOrderStatus(IN p_order_id INT, IN p_status_id INT) 
BEGIN
    UPDATE orders
    SET status_id = p_status_id
    WHERE id = p_order_id;
END;

-- Delete Order
DROP PROCEDURE IF EXISTS DeleteOrder;
CREATE PROCEDURE DeleteOrder(IN p_order_id INT) 
BEGIN
    DELETE FROM orders
    WHERE id = p_order_id;
END;

-- PRODUCTS PROCEDURES

-- Insert Product
DROP PROCEDURE IF EXISTS InsertProduct;
CREATE PROCEDURE InsertProduct(
    IN p_name VARCHAR(255),
    IN p_description TEXT,
    IN p_price DECIMAL(10, 2),
    IN p_stock INT
) 
BEGIN
    INSERT INTO products (name, description, price, stock)
    VALUES (p_name, p_description, p_price, p_stock);

    SELECT LAST_INSERT_ID() AS insertId;
END;

-- Update Product
DROP PROCEDURE IF EXISTS UpdateProduct;
CREATE PROCEDURE UpdateProduct(
    IN p_id INT,
    IN p_name VARCHAR(255),
    IN p_description TEXT,
    IN p_price DECIMAL(10, 2),
    IN p_stock INT
) 
BEGIN
    UPDATE products
    SET name = p_name,
        description = p_description,
        price = p_price,
        stock = p_stock
    WHERE id = p_id;
END;

-- Delete Product
DROP PROCEDURE IF EXISTS DeleteProduct;
CREATE PROCEDURE DeleteProduct(IN p_id INT) 
BEGIN
    DELETE FROM products
    WHERE id = p_id;
END;

-- SESSION PROCEDURES

-- Insert Session
DROP PROCEDURE IF EXISTS InsertSession;
CREATE PROCEDURE InsertSession(IN p_user_id INT, IN p_token VARCHAR(255)) 
BEGIN
    INSERT INTO sessions (user_id, token)
    VALUES (p_user_id, p_token);
END;

-- Delete Session
DROP PROCEDURE IF EXISTS DeleteSession;
CREATE PROCEDURE DeleteSession(IN p_token VARCHAR(255)) 
BEGIN
    DELETE FROM sessions
    WHERE token = p_token;
END;


