const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const queries = require("../config/queries");
const { findUserByEmail, findUserByPhone, createUser } = require("../models/userModel");
const logActivity = require("../utils/logger");
const HTTP = require("../utils/httpStatusCodes");

const validRoles = { admin: 1, user: 2 };
const validStatuses = { active: 1, inactive: 2 };

const mapRoleAndStatus = (role, status) => {
    return {
        roleId: validRoles[role],
        statusId: validStatuses[status],
    };
};

const signupUser = async (req, res) => {
    const { name, email, password, phone_number, status, role, address, description } = req.body;

    if (!name || !email || !password || !role || !phone_number) {
        return res.status(HTTP.BadRequest).json({
            error: "Name, Email, Password, Role, and Phone Number are required",
        });
    }

    const { roleId, statusId } = mapRoleAndStatus(role, status);

    if (!roleId || !statusId) {
        return res.status(HTTP.BadRequest).json({
            error: "Invalid role or status. Allowed roles: admin, user | statuses: active, inactive",
        });
    }

    try {
        const [existingUser, existingPhone] = await Promise.all([
            findUserByEmail(email),
            findUserByPhone(phone_number),
        ]);

        if (existingUser || existingPhone) {
            const reason = existingUser ? "User already exists" : "Phone number already exists";
            logActivity(email, "Signup", `FAILED (${reason})`);
            return res.status(HTTP.BadRequest).json({ error: reason });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const userId = await createUser({
            name,
            email,
            password: hashedPassword,
            phone_number,
            status: statusId,
            role: roleId,
            address,
            description,
        });

        logActivity(email, "Signup", "SUCCESS");
        res.status(HTTP.Created).json({ message: "User registered successfully", userId });
    } catch (err) {
        console.error("Signup error:", err);
        logActivity(email, "Signup", "FAILED (Database error)");
        res.status(HTTP.InternalServerError).json({ error: "Internal Server Error", details: err.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(HTTP.BadRequest).json({ error: "Email and password are required" });
    }

    try {
        const user = await findUserByEmail(email);

        if (!user || !user.password) {
            logActivity(email, "Login", "FAILED (Invalid credentials)");
            return res.status(HTTP.Unauthorized).json({ error: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            logActivity(email, "Login", "FAILED (Invalid password)");
            return res.status(HTTP.Unauthorized).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role_name || user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        await db.query(queries.INSERT_SESSION, [user.id, token]);

        logActivity(email, "Login", "SUCCESS");
        res.status(HTTP.OK).json({ message: "Login successful", token });
    } catch (err) {
        console.error("Login error:", err);
        logActivity(email, "Login", "FAILED (Server error)");
        res.status(HTTP.InternalServerError).json({ error: "Internal Server Error", details: err.message });
    }
};

const logoutUser = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        logActivity("Unknown", "Logout", "FAILED (Missing token)");
        return res.status(HTTP.Unauthorized).json({ error: "Unauthorized. No token provided." });
    }

    try {
        await db.query(queries.DELETE_SESSION, [token]);
        logActivity("Unknown", "Logout", "SUCCESS");
        res.status(HTTP.OK).json({ message: "Logged out successfully" });
    } catch (err) {
        console.error("Logout error:", err);
        logActivity("Unknown", "Logout", "FAILED (Database error)");
        res.status(HTTP.InternalServerError).json({ error: "Internal Server Error", details: err.message });
    }
};

module.exports = { signupUser, loginUser, logoutUser };
