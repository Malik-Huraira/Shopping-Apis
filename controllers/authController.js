const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const queries = require("../config/queries");
const { findUserByEmail, findUserByPhone, createUser } = require("../models/userModel");
const logActivity = require("../utils/logger"); 

const signupUser = async (req, res) => {
    try {
        const { name, email, password, phone_number, status, role, address, description } = req.body;

        if (!name || !email || !password || !role || !phone_number) {
            return res.status(400).json({ error: "Name, Email, Password, Role, and Phone Number are required" });
        }

        const validRoles = ["admin", "user"];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ error: "Invalid role. Allowed values: admin, user" });
        }

       
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            logActivity(email, "Signup", "FAILED (User already exists)");
            return res.status(400).json({ error: "User with this email already exists" });
        }

        
        const existingPhone = await findUserByPhone(phone_number);
        if (existingPhone) {
            logActivity(email, "Signup", "FAILED (Phone number already exists)");
            return res.status(400).json({ error: "User with this phone number already exists" });
        }

      
        const hashedPassword = await bcrypt.hash(password, 12);
        const userId = await createUser({ name, email, password: hashedPassword, phone_number, status, role, address, description });

        logActivity(email, "Signup", "SUCCESS");
        res.status(201).json({ message: "User registered successfully", userId });
    } catch (err) {
        console.error("Signup error:", err);
        logActivity(req.body.email, "Signup", "FAILED (Database error)");
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const user = await findUserByEmail(email);
        if (!user) {
            logActivity(email, "Login", "FAILED (Invalid credentials)");
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            logActivity(email, "Login", "FAILED (Invalid password)");
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || "MY_SECURE_SECRET_12345",
            { expiresIn: "1h" }
        );

        await db.query(queries.INSERT_SESSION, [user.id, token]);

        logActivity(email, "Login", "SUCCESS");
        res.status(200).json({ message: "Login successful", token });
    } catch (err) {
        console.error("Login error:", err);
        logActivity(req.body.email, "Login", "FAILED (Database error)");
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
};

const logoutUser = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            logActivity("Unknown", "Logout", "FAILED (Missing token)");
            return res.status(401).json({ error: "Unauthorized. No token provided." });
        }

        await db.query(queries.DELETE_SESSION, [token]);

        logActivity("Unknown", "Logout", "SUCCESS");
        res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        console.error("Logout error:", err);
        logActivity("Unknown", "Logout", "FAILED (Database error)");
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
};

module.exports = { signupUser, loginUser, logoutUser };
