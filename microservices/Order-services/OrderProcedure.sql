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