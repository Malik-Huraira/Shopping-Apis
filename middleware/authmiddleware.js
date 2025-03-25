const jwt = require('jsonwebtoken');
const db = require('../config/db');
const queries = require('../config/queries');

const authenticateUser = async (req, res, next) => {
    try {

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Unauthorized - No Token Provided" });
        }

        const token = authHeader.split(' ')[1];


        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;


        const [session] = await db.query(queries.GET_SESSION, [token]);
        if (session.length === 0) {
            return res.status(401).json({ error: "Invalid session or session expired" });
        }

        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid token", details: err.message });
    }
};
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ error: "Unauthorized - No User Data" });
        }

        if (!roles.includes(user.role)) {
            return res.status(403).json({ error: "Forbidden - Insufficient Permissions" });
        }

        next();
    };
};

module.exports = { authorizeRoles, authenticateUser };

