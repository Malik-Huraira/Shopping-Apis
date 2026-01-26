const { logger } = require("../utils/logger");
const HTTP = require("../utils/httpStatusCodes");

const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        logger.warn("Authorization failed - no user", {
          ip: req.ip,
          path: req.path,
        });
        return res.status(HTTP.Unauthorized).json({
          error: "Unauthorized",
          message: "User not authenticated",
        });
      }

      if (!allowedRoles.includes(req.user.role)) {
        logger.warn("Authorization failed - insufficient permissions", {
          userId: req.user.userId,
          userRole: req.user.role,
          allowedRoles,
          ip: req.ip,
          path: req.path,
        });
        return res.status(HTTP.Forbidden).json({
          error: "Forbidden",
          message: "Insufficient permissions",
        });
      }

      next();
    } catch (error) {
      logger.error("Authorization error", {
        error: error.message,
        ip: req.ip,
      });

      return res.status(HTTP.InternalServerError).json({
        error: "Server error",
        message: "Authorization check failed",
      });
    }
  };
};

module.exports = authorizeRole;
