const HTTP = require('../utils/httpStatusCodes'); // Import HTTP status codes

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        
        const user = req.user;
        console.log("User in authorizeRoles middleware:", user);

        if (!user) {
            return res.status(HTTP.Unauthorized).json({ error: "Unauthorized - No User Data" });
        }

        if (!roles.includes(user.role)) {
            return res.status(HTTP.Forbidden).json({ error: "Forbidden - Insufficient Permissions" });
        }

        next();
    };
};

module.exports = authorizeRoles;
