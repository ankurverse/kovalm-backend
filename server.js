const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();

/* =========================
   CORS CONFIG
========================= */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

/* =========================
   DATABASE
========================= */
connectDB();

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.send("CollegeCart API Running");
});

/* =========================
   ROUTES
========================= */
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const promotionRoutes = require("./routes/promotionRoutes"); // ✅ NEW

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/promotions", promotionRoutes); // ✅ NEW

/* =========================
   SERVER START
========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server Running on " + PORT);
});
