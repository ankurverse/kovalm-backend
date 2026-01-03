const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();

/* ==============================
   ✅ CORS CONFIG (CRITICAL FIX)
   ============================== */
app.use(
  cors({
    origin: "*", // allow frontend (file://, Netlify, mobile)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// allow preflight requests
app.options("*", cors());

/* ==============================
   MIDDLEWARE
   ============================== */
app.use(express.json());

/* ==============================
   DATABASE
   ============================== */
connectDB();

/* ==============================
   HEALTH CHECK
   ============================== */
app.get("/", (req, res) => {
  res.send("Kovalm Cafe API Running");
});

/* ==============================
   ROUTES
   ============================== */
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

/* ==============================
   SERVER START
   ============================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server Running on " + PORT);
});
