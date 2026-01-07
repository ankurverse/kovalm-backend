const mongoose = require("mongoose");

const promotionSchema = new mongoose.Schema({
  image: String,       // poster image URL
  active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Promotion", promotionSchema);
