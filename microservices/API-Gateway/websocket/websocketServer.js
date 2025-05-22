const WebSocket = require("ws");

const clients = new Set();

function startWebSocketServer() {
  const wss = new WebSocket.Server({ port: 8081 });

  wss.on("connection", (ws) => {
    clients.add(ws);
    console.log("Admin connected");

    ws.on("close", () => {
      clients.delete(ws);
      console.log("Admin disconnected");
    });
  });

  console.log("WebSocket server started on port 8081");
}

function broadcastToAdmins(data) {
  const message = JSON.stringify(data);
  console.log("Broadcasting message to admins:", message);
  console.log("Connected clients:", clients);
  for (const client of clients) {
    client.send(message);
  }
}

module.exports = { startWebSocketServer, broadcastToAdmins };
