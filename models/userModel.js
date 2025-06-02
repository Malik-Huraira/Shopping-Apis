const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    phone_number: String,
    status: String,
    role: String,
    address: String,
    description: String,
    password: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
