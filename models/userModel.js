const db = require('../config/db');
const queries = require('../config/queries');

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

const createUser = async (userData) => {
    const [result] = await db.query(queries.INSERT_USER, [
        userData.name, userData.email, userData.password,  
        userData.phone_number, userData.status, userData.role, 
        userData.address, userData.description
    ]);
    return result.insertId;
};

const getAllUsers = async () => {
    const [users] = await db.query(queries.GET_ALL_USERS);
    return users;
};

const getUserById = async (id) => {
    const [user] = await db.query(queries.GET_USER_BY_ID, [id]);
    return user.length ? user[0] : null;
};

const updateUser = async (id, userData) => {
    const [result] = await db.query(queries.UPDATE_USER, [...extractUserFields(userData), id]);
    return result.affectedRows;
};

const deleteUser = async (id) => {
    const [result] = await db.query(queries.DELETE_USER, [id]);
    return result.affectedRows;
};

const findUserByEmail = async (email) => {
    const [user] = await db.query(queries.GET_USER_BY_EMAIL, [email]);
    return user.length ? user[0] : null;
};

const findUserByPhone = async (phone_number) => {
    const [user] = await db.query(queries.GET_USER_BY_PHONE, [phone_number]);
    return user.length ? user[0] : null;
};

const saveUserSession = async (userId, token) => {
    await db.query(queries.INSERT_SESSION, [userId, token]);
};

const deleteUserSession = async (token) => {
    await db.query(queries.DELETE_SESSION, [token]);
};
const getPaginatedUsers = async (limit, offset) => {
    const [users] = await db.query(queries.GET_PAGINATED_USERS, [limit, offset]);
    return users;
};

const getTotalUsersCount = async () => {
    const [result] = await db.query(queries.GET_TOTAL_USERS_COUNT);
    return result[0].total;
};


module.exports = { 
    getAllUsers, 
    getUserById, 
    createUser, 
    updateUser, 
    deleteUser, 
    findUserByEmail, 
    findUserByPhone, 
    saveUserSession, 
    deleteUserSession,
    getPaginatedUsers,
    getTotalUsersCount
};
