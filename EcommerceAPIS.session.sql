-- ===================== USERS PROCEDURES =====================

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

-- Get Total Users Count
DROP PROCEDURE IF EXISTS GetTotalUsersCount;
CREATE PROCEDURE GetTotalUsersCount()
BEGIN
    SELECT COUNT(*) AS total_users FROM users;
END;

-- Get Paginated Users
DROP PROCEDURE IF EXISTS GetPaginatedUsers;
CREATE PROCEDURE GetPaginatedUsers(IN pageSize INT, IN offsetVal INT)
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
    LIMIT offsetVal, pageSize;
END;

-- ===================== SESSIONS PROCEDURES =====================

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

-- ===================== PRODUCTS PROCEDURES =====================

-- Get All Products
DROP PROCEDURE IF EXISTS GetAllProducts;
CREATE PROCEDURE GetAllProducts() 
BEGIN
    SELECT * FROM products;
END;

-- Get Product by ID
DROP PROCEDURE IF EXISTS GetProductById;
CREATE PROCEDURE GetProductById(IN p_id INT)
BEGIN
    SELECT * FROM products WHERE id = p_id;
END;

-- Get Paginated Products
DROP PROCEDURE IF EXISTS GetPaginatedProducts;
CREATE PROCEDURE GetPaginatedProducts(IN pageSize INT, IN offsetVal INT)
BEGIN
    SELECT * FROM products LIMIT offsetVal, pageSize;
END;

-- Get Total Products Count
DROP PROCEDURE IF EXISTS GetTotalProductsCount;
CREATE PROCEDURE GetTotalProductsCount()
BEGIN
    SELECT COUNT(*) AS total_products FROM products;
END;

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
    DELETE FROM products WHERE id = p_id;
END;

-- ===================== ORDERS PROCEDURES =====================

-- Get Product Price
DROP PROCEDURE IF EXISTS GetProductPrice;
CREATE PROCEDURE GetProductPrice(IN p_product_id INT) 
BEGIN
    SELECT price FROM products WHERE id = p_product_id;
END;

-- Insert Order
DROP PROCEDURE IF EXISTS InsertOrder;
CREATE PROCEDURE InsertOrder(IN p_user_id INT, IN p_total DECIMAL(10, 2)) 
BEGIN
    INSERT INTO orders (user_id, total_price, status_id, created_at)
    VALUES (p_user_id, p_total, 1, NOW());
    SELECT LAST_INSERT_ID() AS order_id;
END;

-- Insert Order Item
DROP PROCEDURE IF EXISTS InsertOrderItem;
CREATE PROCEDURE InsertOrderItem(
    IN p_order_id INT,
    IN p_product_id INT,
    IN p_quantity INT,
    IN p_price DECIMAL(10, 2)
) 
BEGIN
    INSERT INTO order_items (order_id, product_id, quantity)
    VALUES (p_order_id, p_product_id, p_quantity);
END;

-- Get Order by ID
DROP PROCEDURE IF EXISTS GetOrderById;
CREATE PROCEDURE GetOrderById(IN p_order_id INT)
BEGIN
    SELECT * FROM orders WHERE id = p_order_id;
END;

-- Get User Orders
DROP PROCEDURE IF EXISTS GetUserOrders;
CREATE PROCEDURE GetUserOrders(IN p_user_id INT)
BEGIN
    SELECT * FROM orders WHERE user_id = p_user_id;
END;

-- Get Paginated User Orders
DROP PROCEDURE IF EXISTS GetPaginatedUserOrders;
CREATE PROCEDURE GetPaginatedUserOrders(IN pageSize INT, IN offsetVal INT)
BEGIN
    SELECT * FROM orders LIMIT offsetVal, pageSize;
END;

-- Get Total User Orders Count
DROP PROCEDURE IF EXISTS GetTotalUserOrdersCount;
CREATE PROCEDURE GetTotalUserOrdersCount(IN p_user_id INT)
BEGIN
    SELECT COUNT(*) AS total_orders FROM orders WHERE user_id = p_user_id;
END;

-- Update Order Status
DROP PROCEDURE IF EXISTS UpdateOrderStatus;
CREATE PROCEDURE UpdateOrderStatus(
    IN p_order_id INT,
    IN p_status_id INT
)
BEGIN
    UPDATE orders
    SET status_id = p_status_id
    WHERE id = p_order_id;
END;

-- Delete Order
DROP PROCEDURE IF EXISTS DeleteOrder;
CREATE PROCEDURE DeleteOrder(IN p_order_id INT) 
BEGIN
    DELETE FROM orders WHERE id = p_order_id;
END;
SHOW PROCEDURE STATUS WHERE Db = 'edata';
DESCRIBE orders;