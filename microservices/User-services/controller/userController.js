const userModel = require('../model/userModel');
const bcrypt = require('bcryptjs');
const HTTP = require('../utils/httpStatusCodes');
const mapRoleAndStatus = require("../utils/mapRoleAndStatus");

const createUser = async (req, res) => {
    const { name, email, password, phone_number, status, role, address, description } = req.body;

    if (!name || !email || !password || !role || !phone_number) {
        return res.status(HTTP.BadRequest).json({
            error: "Name, Email, Password, Role, and Phone Number are required",
        });
    }

    const { roleId, statusId } = await mapRoleAndStatus(role, status);

    if (!roleId || !statusId) {
        return res.status(HTTP.BadRequest).json({
            error: "Invalid role or status. Allowed roles: admin, user | statuses: active, inactive",
        });
    }

    try {
        const [existingUser, existingPhone] = await Promise.all([
            userModel.findUserByEmail(email),
            userModel.findUserByPhone(phone_number),
        ]);

        if (existingUser || existingPhone) {
            const reason = existingUser ? "User with this email already exists" : "Phone number already exists";
            return res.status(HTTP.BadRequest).json({ error: reason });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const userId = await userModel.createUser({
            name,
            email,
            password: hashedPassword,
            phone_number,
            status: statusId,
            role: roleId,
            address,
            description
        });

        res.status(HTTP.Created).json({ message: "User added successfully", id: userId });
    } catch (err) {
        console.error("Create User Error:", err);
        res.status(HTTP.InternalServerError).json({ error: "Database error", details: err.message });
    }
};


// Get paginated list of users
const getAllUsers = async (req, res) => {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    try {
        const [users, totalUsers] = await Promise.all([
            userModel.getPaginatedUsers(limit, offset),
            userModel.getTotalUsersCount()
        ]);

        res.status(HTTP.OK).json({
            users,
            currentPage: page,
            totalPages: Math.ceil(totalUsers / limit),
            totalUsers,
            limit
        });
    } catch (err) {
        console.error("Get All Users Error:", err);
        res.status(HTTP.InternalServerError).json({ error: "Database error", details: err.message });
    }
};

// Get user by ID
const getUserById = async (req, res) => {
    try {
        const user = await userModel.getUserById(req.params.id);

        if (!user) {
            return res.status(HTTP.NotFound).json({ message: "User not found" });
        }

        res.status(HTTP.OK).json(user);
    } catch (err) {
        console.error("Get User By ID Error:", err);
        res.status(HTTP.InternalServerError).json({ error: "Database error", details: err.message });
    }
};

// Update user
const updateUser = async (req, res) => {
    try {
        const affectedRows = await userModel.updateUser(req.params.id, req.body);

        if (affectedRows === 0) {
            return res.status(HTTP.NotFound).json({ message: "User not found" });
        }

        res.status(HTTP.OK).json({ message: "User updated successfully" });
    } catch (err) {
        console.error("Update User Error:", err);
        res.status(HTTP.InternalServerError).json({ error: "Database error", details: err.message });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        const affectedRows = await userModel.deleteUser(req.params.id);

        if (affectedRows === 0) {
            return res.status(HTTP.NotFound).json({ message: "User not found" });
        }

        res.status(HTTP.OK).json({ message: "User deleted successfully" });
    } catch (err) {
        console.error("Delete User Error:", err);
        res.status(HTTP.InternalServerError).json({ error: "Database error", details: err.message });
    }
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};
