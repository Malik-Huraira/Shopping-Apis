const express = require("express");
const router = express.Router();
const chatController = require("./../Controller/chat.controller");

// Route for chat history
router.get("/history/:userId1/:userId2", chatController.getChatHistory);
router.post("/start", chatController.startChat);
router.get("/all/:userId", chatController.getAllMessages);
router.delete("/delete/:userId1/:userId2", chatController.deleteChatHistory);

module.exports = router;
