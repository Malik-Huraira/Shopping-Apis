const User = require("../models/userModel");

// CREATE USER
const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

// GET USER BY EMAIL
const getUserByEmail = async (email) => {
  return await User.findOne({ email });
};

// GET USER BY ID
const getUserById = async (id) => {
  return await User.findById(id);
};

// GET ALL USERS
const getUsers = async () => {
  return await User.find();
};

// UPDATE USER
const updateUser = async (id, updateData) => {
  return await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

// DELETE USER
const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};

// GET USERS WITH PAGINATION
const getUsersPaginated = async (page = 1, limit = 10) => {
  const parsedPage = parseInt(page, 10);
  const parsedLimit = parseInt(limit, 10);

  const skip = (parsedPage - 1) * parsedLimit;
  const [users, total] = await Promise.all([
    User.find().skip(skip).limit(parsedLimit),
    User.countDocuments(),
  ]);

  return {
    users,
    total,
    page: parsedPage,
    limit: parsedLimit,
    totalPages: Math.ceil(total / parsedLimit),
  };
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  getUsers,
  updateUser,
  deleteUser,
  getUsersPaginated,
};
