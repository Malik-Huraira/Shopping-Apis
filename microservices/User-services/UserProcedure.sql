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

