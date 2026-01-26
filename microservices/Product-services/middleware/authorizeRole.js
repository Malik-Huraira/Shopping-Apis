const HTTP = require("../utils/httpStatusCodes");
const { logger } = require("../utils/logger");

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    const user = req.user;
    logger.info("User in authorizeRoles middleware:", user);

    if (!user) {
      return res
        .status(HTTP.Unauthorized)
        .json({ error: "Unauthorized - No User Data" });
    }

    if (!roles.includes(user.role)) {
      return res
        .status(HTTP.Forbidden)
        .json({ error: "Forbidden - Insufficient Permissions" });
    }

    next();
  };
};

module.exports = authorizeRoles;
