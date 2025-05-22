const app = require("./src/app");
const http = require("http");
const socketHandler = require("./src/socket/index");
const server = http.createServer(app);
const sequelize = require("./src/config/db");
require("dotenv").config();

const PORT = process.env.PORT;
socketHandler(server); // Attach socket

sequelize
  .sync()
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

server.listen(PORT, () => {
  console.log(`Chat service running on port ${PORT}`);
});
