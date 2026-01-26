const express = require("express");
const router = express.Router();
const {
  signupUser,
  loginUser,
  logoutUser,
} = require("../controller/authController");
const authenticateUser = require("../middleware/authmiddleware");
const { authLimiter } = require("../middleware/rateLimiter");

// Public routes
router.post("/signup", authLimiter, signupUser);
router.post("/login", authLimiter, loginUser);

// Protected routes
router.post("/logout", authenticateUser, logoutUser);

module.exports = router;
