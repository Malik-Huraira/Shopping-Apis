const axios = require("axios");

async function authenticateSocket(socket, next) {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("Authentication token missing"));

  try {
    const response = await axios.post(
      "http://auth-service:5001/api/auth/verify",
      { token }
    );
    socket.user = response.data.user;
    next();
  } catch (err) {
    next(new Error("Authentication failed"));
  }
}

module.exports = authenticateSocket;
