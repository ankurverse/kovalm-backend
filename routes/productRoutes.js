const express = require("express");
const router = express.Router();

const {
  addProduct,
  getProducts,
  toggleAvailability
} = require("../controllers/productController");

const auth = require("../middleware/authMiddleware");
const ownerOnly = require("../middleware/ownerOnly");

// STUDENT
router.get("/", getProducts);

// OWNER
router.post("/add", auth, ownerOnly, addProduct);
router.post("/toggle", auth, ownerOnly, toggleAvailability);

module.exports = router;
