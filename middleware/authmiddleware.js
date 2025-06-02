const jwt = require("jsonwebtoken");
const Session = require("../models/SessionModel"); // MongoDB session model

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Unauthorized - No Token Provided" });
    }

    const token = authHeader.split(" ")[1];
    console.log("Extracted Token:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);

    req.user = decoded;

    // MongoDB Session check
    const session = await Session.findOne({ token });
    if (!session) {
      return res
        .status(401)
        .json({ error: "Invalid session or session expired" });
    }

    next();
  } catch (err) {
    return res
      .status(401)
      .json({ error: "Invalid token", details: err.message });
  }
};

module.exports = authenticateUser;
