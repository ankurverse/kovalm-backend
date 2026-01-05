const express = require("express");
const router = express.Router();

const {
  getProducts,
  getAllProductsForOwner,
  addProduct,
  updateProduct,
  deleteProduct,
  toggleAvailability
} = require("../controllers/productController");

const auth = require("../middleware/authMiddleware");
const ownerOnly = require("../middleware/ownerOnly");

/* ============================
   STUDENT ROUTES
============================ */
router.get("/", getProducts);

/* ============================
   OWNER ROUTES (PROTECTED)
============================ */
router.use(auth, ownerOnly);

router.get("/owner/all", getAllProductsForOwner);
router.post("/owner", addProduct);
router.put("/owner/:id", updateProduct);
router.delete("/owner/:id", deleteProduct);
router.patch("/owner/:id/availability", toggleAvailability);

module.exports = router;
