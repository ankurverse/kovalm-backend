const express = require("express");
const router = express.Router();

/* ============================
   CONTROLLERS
============================ */
const {
  getProducts,
  getAllProductsForOwner,
  addProduct,
  updateProduct,
  deleteProduct,
  toggleAvailability,
  updateStock,
  updateStockFromExcel
} = require("../controllers/productController");

/* ============================
   MIDDLEWARE
============================ */
const auth = require("../middleware/authMiddleware");
const ownerOnly = require("../middleware/ownerOnly");
const upload = require("../utils/excelUpload");

/* ============================
   STUDENT ROUTES (PUBLIC)
============================ */
router.get("/", getProducts);

/* ============================
   OWNER ROUTES (PROTECTED)
============================ */

// 🔐 Stock + inventory actions
router.patch("/owner/update-stock", auth, ownerOnly, updateStock);

router.get("/owner/all", auth, ownerOnly, getAllProductsForOwner);
router.post("/owner", auth, ownerOnly, addProduct);
router.put("/owner/:id", auth, ownerOnly, updateProduct);
router.delete("/owner/:id", auth, ownerOnly, deleteProduct);
router.patch("/owner/:id/availability", auth, ownerOnly, toggleAvailability);

// 📥 Excel stock upload
router.post(
  "/owner/upload-stock",
  auth,
  ownerOnly,
  upload.single("file"),
  updateStockFromExcel
);

module.exports = router;
