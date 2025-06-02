const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({
  to: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ["sent", "failed"], required: true },
  messageId: { type: String, default: null },
  error: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("EmailLog", emailSchema);
