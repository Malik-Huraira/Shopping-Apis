const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { publishEvent } = require("../kafka/producer");
const { logger } = require("../utils/logger");
const config = require("../config");
const HTTP = require("../utils/httpStatusCodes");
const {
  validateSignupInput,
  validateLoginInput,
} = require("../utils/validation");

const {
  findUserByEmail,
  findUserByEmailWithPassword,
  findUserByPhone,
  createUser,
  saveUserSession,
  deleteUserSession,
} = require("../model/userModel");

const validRoles = { admin: 1, user: 2 };
const validStatuses = { active: 1, inactive: 2 };

const mapRoleAndStatus = (role, status) => ({
  roleId: validRoles[role],
  statusId: validStatuses[status],
});

const signupUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone_number,
      status = "active",
      role = "user",
      address,
      description,
    } = req.body;

    // Validate input
    const validation = validateSignupInput({
      name,
      email,
      password,
      phone_number,
      role,
      status,
    });

    if (!validation.isValid) {
      logger.warn("Signup validation failed", {
        email,
        errors: validation.errors,
        ip: req.ip,
      });
      return res.status(HTTP.BadRequest).json({
        error: "Validation error",
        message: validation.errors,
      });
    }

    const { roleId, statusId } = mapRoleAndStatus(role, status);

    if (!roleId || !statusId) {
      return res.status(HTTP.BadRequest).json({
        error: "Invalid role or status",
        message: "Allowed roles: admin, user | statuses: active, inactive",
      });
    }

    // Check if user exists
    const [existingUser, existingPhone] = await Promise.all([
      findUserByEmail(email),
      findUserByPhone(phone_number),
    ]);

    if (existingUser) {
      logger.warn("Signup failed - user already exists", {
        email,
        ip: req.ip,
      });
      return res.status(HTTP.Conflict).json({
        error: "Conflict",
        message: "User already exists",
      });
    }

    if (existingPhone) {
      logger.warn("Signup failed - phone already exists", {
        email,
        phone_number,
        ip: req.ip,
      });
      return res.status(HTTP.Conflict).json({
        error: "Conflict",
        message: "Phone number already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await createUser({
      name,
      email,
      password: hashedPassword,
      phone_number,
      address,
      description,
      role_id: roleId,
      status_id: statusId,
    });

    logger.info("User signup successful", {
      userId: user.id,
      email,
      ip: req.ip,
    });

    // Publish event
    try {
      await publishEvent("user-signup", [
        {
          key: user.id.toString(),
          value: JSON.stringify({
            userId: user.id,
            email,
            name,
            timestamp: new Date().toISOString(),
          }),
        },
      ]);
    } catch (error) {
      logger.error("Failed to publish signup event", {
        userId: user.id,
        error: error.message,
      });
    }

    res.status(HTTP.Created).json({
      message: "User created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone_number: user.phone_number,
      },
    });
  } catch (error) {
    logger.error("Signup error", {
      error: error.message,
      ip: req.ip,
    });

    res.status(HTTP.InternalServerError).json({
      error: "Server error",
      message: "Failed to create user",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    const validation = validateLoginInput({ email, password });

    if (!validation.isValid) {
      logger.warn("Login validation failed", {
        email,
        errors: validation.errors,
        ip: req.ip,
      });
      return res.status(HTTP.BadRequest).json({
        error: "Validation error",
        message: validation.errors,
      });
    }

    // Find user
    const user = await findUserByEmailWithPassword(email);

    if (!user) {
      logger.warn("Login failed - user not found", {
        email,
        ip: req.ip,
      });
      return res.status(HTTP.Unauthorized).json({
        error: "Unauthorized",
        message: "Invalid credentials",
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      logger.warn("Login failed - invalid password", {
        email,
        ip: req.ip,
      });
      return res.status(HTTP.Unauthorized).json({
        error: "Unauthorized",
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role_id,
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn },
    );

    // Save session
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await saveUserSession({
      user_id: user.id,
      token,
      ip_address: req.ip,
      user_agent: req.get("user-agent"),
      expires_at: expiresAt,
    });

    logger.info("User login successful", {
      userId: user.id,
      email,
      ip: req.ip,
    });

    res.status(HTTP.OK).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    logger.error("Login error", {
      error: error.message,
      ip: req.ip,
    });

    res.status(HTTP.InternalServerError).json({
      error: "Server error",
      message: "Login failed",
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    const token = req.token;

    if (!token) {
      return res.status(HTTP.BadRequest).json({
        error: "Bad request",
        message: "No token provided",
      });
    }

    // Revoke session
    await deleteUserSession(token);

    logger.info("User logout successful", {
      userId: req.user.userId,
      ip: req.ip,
    });

    res.status(HTTP.OK).json({
      message: "Logout successful",
    });
  } catch (error) {
    logger.error("Logout error", {
      error: error.message,
      ip: req.ip,
    });

    res.status(HTTP.InternalServerError).json({
      error: "Server error",
      message: "Logout failed",
    });
  }
};

module.exports = {
  signupUser,
  loginUser,
  logoutUser,
};
