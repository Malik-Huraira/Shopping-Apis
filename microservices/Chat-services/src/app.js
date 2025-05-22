const express = require("express");
const cors = require("cors");
const chatRoutes = require("./routes/chat.route");
require("dotenv").config();

const app = express();
app.use(express.json());

app.use(cors());

// Routes
app.use("/api/chat", chatRoutes);

module.exports = app;
