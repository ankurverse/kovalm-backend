const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  customerName: String,
  customerPhone: String,
  roomNo: String,

  items: [
    {
      productId: String,
      name: String,
      price: Number,
      qty: Number
    }
  ],

  subtotal: Number,
  deliveryCharge: {
    type: Number,
    default: 4
  },
  totalAmount: Number,

  transactionId: String,

  paymentStatus: {
    type: String,
    default: "verifying" // verifying → paid / failed
  },

  status: {
    type: String,
    default: "pending" // pending → accepted → preparing → delivered
  }

}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
