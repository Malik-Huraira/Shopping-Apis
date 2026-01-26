const jwt = require("jsonwebtoken");
const { logger } = require("../utils/logger");
const HTTP = require("../utils/httpStatusCodes");
const { Session } = require("../model");

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logger.warn("Authorization header missing or malformed", {
        ip: req.ip,
        path: req.path,
      });
      return res.status(HTTP.Unauthorized).json({
        error: "Unauthorized",
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      logger.warn("Token not found in Authorization header", {
        ip: req.ip,
        path: req.path,
      });
      return res.status(HTTP.Unauthorized).json({
        error: "Unauthorized",
        message: "Invalid token format",
      });
    }

    if (!process.env.JWT_SECRET) {
      logger.error("JWT_SECRET not configured");
      return res.status(HTTP.InternalServerError).json({
        error: "Server error",
        message: "Authentication service misconfigured",
      });
    }

    // Check if token is revoked
    const session = await Session.findOne({
      where: { token, is_revoked: false },
    });
    if (!session) {
      logger.warn("Token revoked or not found", {
        ip: req.ip,
        path: req.path,
      });
      return res.status(HTTP.Unauthorized).json({
        error: "Unauthorized",
        message: "Token has been revoked",
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user data to request
    req.user = decoded;
    req.token = token;

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      logger.warn("Token expired", {
        ip: req.ip,
        path: req.path,
      });
      return res.status(HTTP.Unauthorized).json({
        error: "Unauthorized",
        message: "Token has expired",
      });
    }

    if (err.name === "JsonWebTokenError") {
      logger.warn("Invalid token", {
        ip: req.ip,
        path: req.path,
      });
      return res.status(HTTP.Unauthorized).json({
        error: "Unauthorized",
        message: "Invalid token",
      });
    }

    logger.error("Authentication error", {
      error: err.message,
      ip: req.ip,
      path: req.path,
    });

    return res.status(HTTP.InternalServerError).json({
      error: "Server error",
      message: "Authentication failed",
    });
  }
};

module.exports = authenticateUser;
