const express = require("express");
const router = express.Router();
const { broadcastToAdmins } = require("../websocket/websocketServer");

router.post("/", (req, res) => {
  const notification = req.body;
  console.log("Notification received:", notification);
  broadcastToAdmins(notification);
  res.status(200).json({ message: "Notification sent to admin dashboard" });
});

module.exports = router;
