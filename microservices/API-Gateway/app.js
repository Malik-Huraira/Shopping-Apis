const express = require("express");
const morgan = require("morgan");
const axios = require("axios");
const notifyRoutes = require("./routes/notify.route");
require("dotenv").config();

const proxyRoutes = require("./routes/proxy"); // all proxy routes here

const app = express();

// ========== MIDDLEWARE ==========
app.use(express.json());
app.use(morgan("dev"));

// ========== GATEWAY HEALTH CHECK ==========
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", service: "API Gateway" });
});

// ========== CHECK ALL MICROservices' HEALTH ==========
app.get("/health/all", async (req, res) => {
  const services = {
    auth: "http://localhost:5001/health",
    email: "http://localhost:5002/health",
    orders: "http://localhost:5003/health",
    products: "http://localhost:5004/health",
    users: "http://localhost:5005/health",
  };

  const results = {};

  await Promise.all(
    Object.entries(services).map(async ([name, url]) => {
      try {
        const response = await axios.get(url);
        results[name] = response.data;
      } catch (err) {
        results[name] = { status: "DOWN", error: err.message };
      }
    })
  );

  res.json(results);
});

// ========== PROXY ROUTES ==========

app.use("/notify", notifyRoutes); // Notify route for admin dashboard
app.use("/", proxyRoutes);

module.exports = app;
