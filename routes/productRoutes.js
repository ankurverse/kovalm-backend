const express = require("express");
const router = express.Router();
const { updateStockFromExcel } = require("../controllers/productController");


const {
  getProducts,
  getAllProductsForOwner,
  addProduct,
  updateProduct,
  deleteProduct,
  toggleAvailability,
  updateStock   // ✅ ADD
} = require("../controllers/productController");


const auth = require("../middleware/authMiddleware");
const ownerOnly = require("../middleware/ownerOnly");
const upload = require("../utils/excelUpload");

/* ============================
   STUDENT ROUTES
============================ */
router.get("/", getProducts);

/* ============================
   OWNER ROUTES (PROTECTED)
============================ */
router.patch("/owner/update-stock", updateStock);


router.use(auth, ownerOnly);

router.get("/owner/all", getAllProductsForOwner);
router.post("/owner", addProduct);
router.put("/owner/:id", updateProduct);
router.delete("/owner/:id", deleteProduct);
router.patch("/owner/:id/availability", toggleAvailability);



router.post(
  "/owner/upload-stock",
  upload.single("file"),
  updateStockFromExcel
);


module.exports = router;