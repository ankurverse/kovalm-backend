const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  paymentProof,
  getOrdersForOwner,
  acceptOrder,
  declineOrder,
  updateStatus,
  getMyOrders,
  superAnalytics,
  getOrderStatus,
  toggleOrders,
  validateCartStock // ✅ ADD THIS
} = require("../controllers/orderController");

/* ============================
   STUDENT ROUTES
============================ */

// 🔒 Validate stock BEFORE checkout
router.post("/validate-stock", auth, validateCartStock);

// Create order after payment
router.post("/payment", auth, paymentProof);

// My orders
router.get("/my", auth, getMyOrders);

// Check shop open/close status
router.get("/status", getOrderStatus);


/* ============================
   OWNER ROUTES
============================ */

// Get all orders
router.get("/owner/all", auth, getOrdersForOwner);

// Analytics
router.get("/owner/super-analytics", auth, superAnalytics);

// Shop open / close
router.get("/owner/status", auth, getOrderStatus);
router.post("/owner/toggle", auth, toggleOrders);

// Order actions
router.post("/owner/accept", auth, acceptOrder);
router.post("/owner/decline", auth, declineOrder);
router.post("/owner/status", auth, updateStatus);

module.exports = router;
