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

DROP PROCEDURE IF EXISTS GetUserByPhone;
CREATE PROCEDURE GetUserByPhone(IN userPhone VARCHAR(20)) 
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
    WHERE u.phone_number = userPhone;
END;

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

