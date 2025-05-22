const axios = require("axios");
const https = require("https"); 

async function notifyNewOrder({
  userId,
  products,
  total_price,
  timestamp,
}) {
    try {
      const httpsAgent = new https.Agent({
        rejectUnauthorized: false,
      });

    await axios.post(
      "https://localhost:5000/notify",
      {
        type: "new_order",
        message: `🛒 New order created (User ID: ${userId})`,
        userId,
        products,
        total_price,
        timestamp,
      },
      { httpsAgent }
    );
  } catch (err) {
    console.error("Error notifying admin:", err);
    console.error("Failed to notify admin:", err.message);
  }
}
module.exports = notifyNewOrder;