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
        console.log("Extracted Token:", token); 

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded); 
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


module.exports = authenticateUser ;

