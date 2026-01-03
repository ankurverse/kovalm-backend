const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();
app.use(express.json());
app.use(cors());

// Connect DB
connectDB();

app.get("/", (req, res) => {
  res.send("Kovalm Cafe API Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server Running on " + PORT));
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);
const orderRoutes = require("./routes/orderRoutes");
app.use("/api/orders", orderRoutes);
