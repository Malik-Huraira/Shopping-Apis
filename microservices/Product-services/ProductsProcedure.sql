
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

