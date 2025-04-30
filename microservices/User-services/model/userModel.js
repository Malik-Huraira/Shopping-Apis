const User = require('./User');
const { Op } = require('sequelize');

// Create User
const createUser = async (userData) => {
    const user = await User.create(userData);
    return user.id;
};

// Find User By Email
const findUserByEmail = async (email) => {
    return await User.findOne({ where: { email } });
};

// Find User By Phone
const findUserByPhone = async (phone_number) => {
    return await User.findOne({ where: { phone_number } });
};

// Get User By ID
const getUserById = async (id) => {
    return await User.findByPk(id);
};

// Update User
const updateUser = async (id, userData) => {
    const [affectedRows] = await User.update(userData, { where: { id } });
    return affectedRows;
};

// Delete User
const deleteUser = async (id) => {
    const affectedRows = await User.destroy({ where: { id } });
    return affectedRows;
};

// Paginated Users
const getPaginatedUsers = async (limit, offset) => {
    return await User.findAll({ limit, offset });
};

// Total Users Count
const getTotalUsersCount = async () => {
    return await User.count();
};

module.exports = {
    createUser,
    findUserByEmail,
    findUserByPhone,
    getUserById,
    updateUser,
    deleteUser,
    getPaginatedUsers,
    getTotalUsersCount
};
