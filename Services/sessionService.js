const Session = require("../models/SessionModel");

const createSession = async (userId, token) => {
  const session = new Session({ user: userId, token });
  const savedSession = await session.save();
  return savedSession._id;
};

const getSessionByToken = async (token) => {
  return await Session.findOne({ token }).populate("user");
};

const deleteSession = async (token) => {
  const result = await Session.deleteOne({ token });
  return result.deletedCount;
};

const deleteSessionsByUserId = async (userId) => {
  const result = await Session.deleteMany({ user: userId });
  return result.deletedCount;
};

module.exports = {
  createSession,
  getSessionByToken,
  deleteSession,
  deleteSessionsByUserId,
};
