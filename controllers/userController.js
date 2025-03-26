const userModel = require('../models/userModel'); // Importing User Model
const bcrypt = require('bcryptjs');

const createUser = async (req, res) => {
    try {
        const { name, email, password, phone_number, status, role, address, description } = req.body;

        if (!name || !email || !password || !phone_number || !status || !role) {
            return res.status(400).json({ error: "Missing required fields (Name, Email, Password, Phone, Status, Role)" });
        }

        // Check if user already exists
        const existingUser = await userModel.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: "User with this email already exists" });
        }

        // Hashing Password
        const hashedPassword = await bcrypt.hash(password, 10);

        const userId = await userModel.createUser({
            name, email, password: hashedPassword, phone_number, status, role, address, description
        });

        res.status(201).json({ message: "User added successfully", id: userId });

    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).json({ error: "Database error", details: err.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.getAllUsers();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await userModel.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const affectedRows = await userModel.updateUser(req.params.id, req.body);
        if (affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const affectedRows = await userModel.deleteUser(req.params.id);
        if (affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};
