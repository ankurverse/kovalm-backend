const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("CollegeCart API Running");
});

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const promotionRoutes = require("./routes/promotionRoutes"); // ✅ IMPORTANT

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/promotions", promotionRoutes); // ✅ IMPORTANT

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on " + PORT);
});
