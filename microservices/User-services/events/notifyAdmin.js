const axios = require("axios");
const https = require("https"); 

async function notifyNewUser(
  userId,
  name,
  email,
  phone_number,
  status,
  role,
  address,
  description
) {
  try {
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });

    await axios.post(
      "https://localhost:5000/notify",
      {
        type: "new_user",
        message: `👤 New user registered (ID: ${userId})`,
        userId,
        name,
        email,
        phone_number,
        status,
        role,
        address,
        description,
      },
      { httpsAgent } // Passed as an option
    );
  } catch (err) {
    console.error("Error notifying admin:", err);
    console.error("Failed to notify admin:", err.message);
  }
}

module.exports = notifyNewUser;
