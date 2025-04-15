const db = require('../config/db');
const queries = require('../config/queries');

// Extract user fields for insertion and update
const extractUserFields = (userData) => {
    return [
        userData.name,
        userData.email,
        userData.phone_number,
        userData.status,
        userData.role,
        userData.address,
        userData.description,
        userData.password
    ];
};

// Create a new user
const createUser = async (userData) => {
    const [result] = await db.query("CALL InsertUser(?, ?, ?, ?, ?, ?, ?, ?)", [
        userData.name, userData.email, userData.password,
        userData.phone_number, userData.status, userData.role,
        userData.address, userData.description
    ]);
    return result.insertId;
};

// Get all users
const getAllUsers = async () => {
    const [users] = await db.query("CALL GetAllUsers()");
    return users;
};

// Get user by ID
const getUserById = async (id) => {
    const [user] = await db.query("CALL GetUserById(?)", [id]);
    return user.length ? user[0] : null;
};

// Update an existing user
const updateUser = async (id, userData) => {
    const [result] = await db.query("CALL UpdateUser(?, ?, ?, ?, ?, ?, ?, ?)", [
        ...extractUserFields(userData), id
    ]);
    return result.affectedRows;
};

// Delete a user
const deleteUser = async (id) => {
    const [result] = await db.query("CALL DeleteUser(?)", [id]);
    return result.affectedRows;
};

// Find a user by email
const findUserByEmail = async (email) => {
    const [user] = await db.query("CALL GetUserByEmail(?)", [email]);
    return user[0]?.length ? user[0][0] : null;
};

// Find a user by phone number
const findUserByPhone = async (phone_number) => {
    const [user] = await db.query("CALL GetUserByPhone(?)", [phone_number]);
    return user[0]?.length ? user[0][0] : null;
};

// Save a user's session
const saveUserSession = async (userId, token) => {
    await db.query("CALL InsertSession(?, ?)", [userId, token]);
};

// Delete a user's session
const deleteUserSession = async (token) => {
    await db.query("CALL DeleteSession(?)", [token]);
};

// Get paginated users
const getPaginatedUsers = async (limit, offset) => {
    const [users] = await db.query("CALL GetPaginatedUsers(?, ?)", [limit, offset]);
    return users;
};

// Get total count of users
const getTotalUsersCount = async () => {
    const [result] = await db.query("CALL GetTotalUsersCount()");
    return result[0].total;
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    findUserByEmail,
    findUserByPhone,
    saveUserSession,
    deleteUserSession,
    getPaginatedUsers,
    getTotalUsersCount
};
