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
  updateStockFromExcel,
  undoLastExcelUpload   // ✅ ADD THIS
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

// Manual stock update
router.patch("/owner/update-stock", auth, ownerOnly, updateStock);

// Product CRUD
router.get("/owner/all", auth, ownerOnly, getAllProductsForOwner);
router.post("/owner", auth, ownerOnly, addProduct);
router.put("/owner/:id", auth, ownerOnly, updateProduct);
router.delete("/owner/:id", auth, ownerOnly, deleteProduct);
router.patch("/owner/:id/availability", auth, ownerOnly, toggleAvailability);

// Excel stock upload
router.post(
  "/owner/upload-stock",
  auth,
  ownerOnly,
  upload.single("file"),
  updateStockFromExcel
);

// 🔁 UNDO LAST EXCEL UPLOAD (NEW)
router.post(
  "/owner/undo-last-upload",
  auth,
  ownerOnly,
  undoLastExcelUpload
);

module.exports = router;
