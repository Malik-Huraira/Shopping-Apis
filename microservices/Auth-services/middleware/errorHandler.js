const { logger } = require("../utils/logger");
const HTTP = require("../utils/httpStatusCodes");

const errorHandler = (err, req, res, next) => {
  const isDevelopment = process.env.NODE_ENV === "development";

  logger.error("Unhandled error", {
    error: err.message,
    stack: isDevelopment ? err.stack : undefined,
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  // Sequelize validation error
  if (err.name === "SequelizeValidationError") {
    return res.status(HTTP.UnprocessableEntity).json({
      error: "Validation error",
      message: err.errors.map((e) => e.message),
    });
  }

  // Sequelize unique constraint error
  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(HTTP.Conflict).json({
      error: "Conflict",
      message: "Resource already exists",
    });
  }

  // Default error response
  return res.status(err.status || HTTP.InternalServerError).json({
    error: err.error || "Server error",
    message: isDevelopment ? err.message : "An unexpected error occurred",
  });
};

module.exports = errorHandler;
