const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const logActivity = require("../utils/logger");
const Session = require("../Services/sessionService");
const HTTP = require("../utils/httpStatusCodes");

const signupUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone_number,
      status,
      role,
      address,
      description,
    } = req.body;

    if (!name || !email || !password || !role || !phone_number) {
      return res.status(HTTP.BadRequest).json({
        error: "Name, Email, Password, Role, and Phone Number are required",
      });
    }

    const validRoles = ["admin", "user"];
    if (!validRoles.includes(role)) {
      return res
        .status(HTTP.BadRequest)
        .json({ error: "Invalid role. Allowed values: admin, user" });
    }

    const existingUser = await User.getUserByEmail(email);
    if (existingUser) {
      logActivity(email, "Signup", "FAILED (User already exists)");
      return res
        .status(HTTP.BadRequest)
        .json({ error: "User with this email already exists" });
    }

   
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone_number,
      status,
      role,
      address,
      description,
    });

    const savedUser = await newUser.save();

    logActivity(email, "Signup", "SUCCESS");
    res
      .status(HTTP.Created)
      .json({ message: "User registered successfully", userId: savedUser._id });
  } catch (err) {
    console.error("Signup error:", err);
    logActivity(req.body.email, "Signup", "FAILED (Database error)");
    res
      .status(HTTP.InternalServerError)
      .json({ error: "Internal Server Error", details: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(HTTP.BadRequest)
        .json({ error: "Email and password are required" });
    }

    const user = await User.getUserByEmail(email);
    if (!user) {
      logActivity(email, "Login", "FAILED (Invalid credentials)");
      return res
        .status(HTTP.Unauthorized)
        .json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logActivity(email, "Login", "FAILED (Invalid password)");
      return res
        .status(HTTP.Unauthorized)
        .json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    await Session.create({ userId: user._id, token });

    logActivity(email, "Login", "SUCCESS");
    res.status(HTTP.OK).json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err);
    logActivity(req.body.email, "Login", "FAILED (Database error)");
    res
      .status(HTTP.InternalServerError)
      .json({ error: "Internal Server Error", details: err.message });
  }
};

const logoutUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      logActivity("Unknown", "Logout", "FAILED (Missing token)");
      return res
        .status(HTTP.Unauthorized)
        .json({ error: "Unauthorized. No token provided." });
    }

    const result = await Session.deleteOne({ token });

    logActivity(
      "Unknown",
      "Logout",
      result.deletedCount ? "SUCCESS" : "FAILED (Session not found)"
    );
    res.status(HTTP.OK).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    logActivity("Unknown", "Logout", "FAILED (Database error)");
    res
      .status(HTTP.InternalServerError)
      .json({ error: "Internal Server Error", details: err.message });
  }
};

module.exports = { signupUser, loginUser, logoutUser };
