const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
  roomNo: String,
  role: { type: String, default: "student" },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
