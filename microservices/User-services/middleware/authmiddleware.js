const jwt = require("jsonwebtoken");
const HTTP = require("../utils/httpStatusCodes"); // your centralized HTTP codes

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      console.error("Authorization header is missing or malformed.");
      return res
        .status(HTTP.Unauthorized)
        .json({ error: "Unauthorized - No Token Provided" });
    }

    // Extract the token from the Authorization header
    const token = authHeader.split(" ")[1];

    // Check if token is undefined or empty
    if (!token) {
      return res
        .status(HTTP.Unauthorized)
        .json({ error: "Unauthorized - No Token Found" });
    }

    // Check if JWT_SECRET is defined in environment variables
    if (!process.env.JWT_SECRET) {
      return res
        .status(HTTP.InternalServerError)
        .json({ error: "Server configuration error" });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user data to the request object
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Auth Error:", err.message);
    return res
      .status(HTTP.Unauthorized)
      .json({ error: "Invalid token", details: err.message });
  }
};

module.exports = authenticateUser;
