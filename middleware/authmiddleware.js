const jwt = require('jsonwebtoken');
const db = require('../config/db');
const queries = require('../config/queries');
const HTTP = require('../utils/httpStatusCodes'); // your centralized HTTP codes

const authenticateUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer")) {
            console.error("Authorization header is missing or malformed.");
            return res.status(HTTP.Unauthorized).json({ error: "Unauthorized - No Token Provided" });
        }

        // Extract the token from the Authorization header
        const token = authHeader.split(' ')[1];
        console.log("Extracted Token:", token);

        // Check if token is undefined or empty
        if (!token) {
            console.error("No token found in Authorization header.");
            return res.status(HTTP.Unauthorized).json({ error: "Unauthorized - No Token Found" });
        }

        // Check if JWT_SECRET is defined in environment variables
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not defined in environment variables");
            return res.status(HTTP.InternalServerError).json({ error: "Server configuration error" });
        }

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded);

        // Attach the decoded user data to the request object
        req.user = decoded;

        // // Check if the session exists in the database
        // const [session] = await db.query(queries.GET_SESSION, [token]);

        // if (!session || session.length === 0) {
        //     return res.status(HTTP.Unauthorized).json({ error: "Invalid session or session expired" });
        // }

        next();
    } catch (err) {
        console.error("Auth Error:", err.message);
        return res.status(HTTP.Unauthorized).json({ error: "Invalid token", details: err.message });
    }
};

module.exports = authenticateUser;


