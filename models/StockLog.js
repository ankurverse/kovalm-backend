const mongoose = require("mongoose");

const stockLogSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["EXCEL_UPLOAD"],
    required: true
  },

  changes: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },
      quantityAdded: Number
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("StockLog", stockLogSchema);
