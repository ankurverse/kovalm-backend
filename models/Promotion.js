const mongoose = require("mongoose");

const promotionSchema = new mongoose.Schema(
  {
    image: String,
    active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Promotion", promotionSchema);
