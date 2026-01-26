const User = require("./User");
const Session = require("./Session");
const { logger } = require("../utils/logger");

const findUserByEmail = async (email) => {
  try {
    return await User.findOne({
      where: { email },
      attributes: { exclude: ["password"] },
    });
  } catch (error) {
    logger.error("Error finding user by email", {
      email,
      error: error.message,
    });
    throw error;
  }
};

const findUserByEmailWithPassword = async (email) => {
  try {
    return await User.findOne({
      where: { email },
    });
  } catch (error) {
    logger.error("Error finding user by email with password", {
      email,
      error: error.message,
    });
    throw error;
  }
};

const findUserByPhone = async (phone_number) => {
  try {
    return await User.findOne({
      where: { phone_number },
    });
  } catch (error) {
    logger.error("Error finding user by phone", {
      phone_number,
      error: error.message,
    });
    throw error;
  }
};

const findUserById = async (id) => {
  try {
    return await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });
  } catch (error) {
    logger.error("Error finding user by id", {
      id,
      error: error.message,
    });
    throw error;
  }
};

const createUser = async (userData) => {
  try {
    return await User.create(userData);
  } catch (error) {
    logger.error("Error creating user", {
      email: userData.email,
      error: error.message,
    });
    throw error;
  }
};

const updateUser = async (id, userData) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error("User not found");
    }
    return await user.update(userData);
  } catch (error) {
    logger.error("Error updating user", {
      id,
      error: error.message,
    });
    throw error;
  }
};

const deleteUser = async (id) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error("User not found");
    }
    return await user.destroy();
  } catch (error) {
    logger.error("Error deleting user", {
      id,
      error: error.message,
    });
    throw error;
  }
};

const saveUserSession = async (sessionData) => {
  try {
    return await Session.create(sessionData);
  } catch (error) {
    logger.error("Error saving user session", {
      userId: sessionData.user_id,
      error: error.message,
    });
    throw error;
  }
};

const deleteUserSession = async (token) => {
  try {
    return await Session.update({ is_revoked: true }, { where: { token } });
  } catch (error) {
    logger.error("Error deleting user session", {
      error: error.message,
    });
    throw error;
  }
};

const getUserSessions = async (userId) => {
  try {
    return await Session.findAll({
      where: { user_id: userId, is_revoked: false },
    });
  } catch (error) {
    logger.error("Error getting user sessions", {
      userId,
      error: error.message,
    });
    throw error;
  }
};

module.exports = {
  findUserByEmail,
  findUserByEmailWithPassword,
  findUserByPhone,
  findUserById,
  createUser,
  updateUser,
  deleteUser,
  saveUserSession,
  deleteUserSession,
  getUserSessions,
};
