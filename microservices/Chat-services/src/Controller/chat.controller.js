const Message = require("../model/chat.model");
const { Op } = require("sequelize");

// Get chat history between two users
const getChatHistory = async (req, res) => {
  const userId1 = parseInt(req.params.userId1);
  const userId2 = parseInt(req.params.userId2);

  if (isNaN(userId1) || isNaN(userId2)) {
    return res.status(400).json({ message: "Invalid user IDs" });
  }

  try {
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 },
        ],
      },
      order: [["createdAt", "ASC"]],
    });

    console.log(`[CHAT] Chat history between ${userId1} ↔ ${userId2} fetched.`);
    res.json(messages);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ message: "Failed to load messages" });
  }
};

// Start a new chat message
const startChat = async (req, res) => {
  const { senderId, receiverId, content } = req.body;

  if (!senderId || !receiverId || !content?.trim()) {
    return res.status(400).json({ message: "Missing or invalid message data" });
  }

  try {
    const message = await Message.create({
      senderId: parseInt(senderId),
      receiverId: parseInt(receiverId),
      content: content.trim(),
    });

    console.log(`[CHAT] Message sent from ${senderId} to ${receiverId}`);
    res.status(201).json(message);
  } catch (error) {
    console.error("Error starting chat:", error);
    res.status(500).json({ message: "Failed to start chat" });
  }
};

// Get all messages involving a user (paginated)
const getAllMessages = async (req, res) => {
  const userId = parseInt(req.params.userId);
  const limit = parseInt(req.query.limit) || 20;
  const offset = parseInt(req.query.offset) || 0;

  if (isNaN(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const messages = await Message.findAll({
      where: {
        [Op.or]: [{ senderId: userId }, { receiverId: userId }],
      },
      order: [["createdAt", "ASC"]],
      limit,
      offset,
    });

    console.log(
      `[CHAT] Messages for user ${userId} fetched with limit=${limit}, offset=${offset}`
    );
    res.json(messages);
  } catch (error) {
    console.error("Error fetching all messages:", error);
    res.status(500).json({ message: "Failed to load messages" });
  }
};

// Delete conversation between two users
const deleteChatHistory = async (req, res) => {
  const userId1 = parseInt(req.params.userId1);
  const userId2 = parseInt(req.params.userId2);

  if (isNaN(userId1) || isNaN(userId2)) {
    return res.status(400).json({ message: "Invalid user IDs" });
  }

  try {
    const deletedCount = await Message.destroy({
      where: {
        [Op.or]: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 },
        ],
      },
    });

    console.log(
      `[CHAT] Deleted ${deletedCount} messages between ${userId1} ↔ ${userId2}`
    );
    res.status(200).json({ message: "Conversation deleted" });
  } catch (error) {
    console.error("Error deleting chat:", error);
    res.status(500).json({ message: "Failed to delete conversation" });
  }
};

module.exports = {
  getChatHistory,
  startChat,
  getAllMessages,
  deleteChatHistory,
};
