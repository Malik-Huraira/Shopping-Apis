const { Server } = require("socket.io");
const authenticateSocket = require("../middleware/chat.middleware");
const Message = require("../model/chat.model");

function socketHandler(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.use(authenticateSocket);

  io.on("connection", (socket) => {
    console.log(`User ${socket.user.id} connected`);

    socket.on("private-message", async ({ toUserId, content }) => {
      const message = await Message.create({
        senderId: socket.user.id,
        receiverId: toUserId,
        content,
      });

      // Emit message to receiver if connected
      io.to(toUserId.toString()).emit("new-message", message);
    });

    socket.join(socket.user.id.toString());

    socket.on("disconnect", () => {
      console.log(`User ${socket.user.id} disconnected`);
    });
  });
}

module.exports = socketHandler;
