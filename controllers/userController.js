const User = require("../Services/userService");
const bcrypt = require('bcryptjs');
const HTTP = require('../utils/httpStatusCodes');

const createUser = async (req, res) => {
    try {
        const { name, email, password, phone_number, status, role, address, description } = req.body;

        if (!name || !email || !password || !phone_number || !status || !role) {
            return res.status(HTTP.BadRequest).json({ error: "Missing required fields (Name, Email, Password, Phone, Status, Role)" });
        }

        const existingUser = await User.findUserByEmail(email);
        if (existingUser) {
            return res.status(HTTP.BadRequest).json({ error: "User with this email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userId = await User.createUser({
          name,
          email,
          password: hashedPassword,
          phone_number,
          status,
          role,
          address,
          description,
        });

        res.status(HTTP.Created).json({ message: "User added successfully", id: userId });

    } catch (err) {
        console.error("Create User Error:", err.message);
        res.status(HTTP.InternalServerError).json({ error: "Database error", details: err.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        let { page, limit } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const offset = (page - 1) * limit;

        const users = await User.getPaginatedUsers(limit, offset);
        const totalUsers = await User.getTotalUsersCount();

        res.status(HTTP.OK).json({
            users,
            currentPage: page,
            totalPages: Math.ceil(totalUsers / limit),
            totalUsers,
            limit,
        });

    } catch (err) {
        res.status(HTTP.InternalServerError).json({ error: 'Database error', details: err.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.getUserById(req.params.id);
        if (!user) {
            return res.status(HTTP.NotFound).json({ message: 'User not found' });
        }
        res.status(HTTP.OK).json(user);
    } catch (err) {
        res.status(HTTP.InternalServerError).json({ error: 'Database error', details: err.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const affectedRows = await User.updateUser(req.params.id, req.body);
        if (affectedRows === 0) {
            return res.status(HTTP.NotFound).json({ message: 'User not found' });
        }
        res.status(HTTP.OK).json({ message: 'User updated successfully' });
    } catch (err) {
        res.status(HTTP.InternalServerError).json({ error: 'Database error', details: err.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const affectedRows = await User.deleteUser(req.params.id);
        if (affectedRows === 0) {
            return res.status(HTTP.NotFound).json({ message: 'User not found' });
        }
        res.status(HTTP.OK).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(HTTP.InternalServerError).json({ error: 'Database error', details: err.message });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};
