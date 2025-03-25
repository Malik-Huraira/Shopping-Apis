const db = require('../config/db');
const queries = require('../config/queries');
const bcrypt = require('bcryptjs');

const createUser = async (req, res) => {
    try {
        const { name, email, password, phone_number, status, role, address, description } = req.body;
        if (!name || !email || !password || !phone_number || !status || !role) {
            return res.status(400).json({ error: "Missing required fields (Name, Email, Password, Phone, Status, Role)" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.query(queries.INSERT_USER, [name, email, hashedPassword, phone_number, status, role, address, description]);
        res.status(201).json({ message: "User added successfully", id: result.insertId });
    } catch (err) {
        console.error("Database Error:", err.message);
        res.status(500).json({ error: "Database error", details: err.message });
    }
};


const getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query(queries.GET_ALL_USERS);
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
};


const getUserById = async (req, res) => {
    try {
        const [user] = await db.query(queries.GET_USER_BY_ID, [req.params.id]);
        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user[0]);
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
};


const updateUser = async (req, res) => {
    try {
        const { name, email, phone_number, status, address, description } = req.body;

        const [result] = await db.query(queries.UPDATE_USER, [name, email, phone_number, status, address, description, req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const [result] = await db.query(queries.DELETE_USER, [req.params.id]);
        if (result.affectedRows === 0) {
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
