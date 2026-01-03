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
  toggleOrders
} = require("../controllers/orderController");

router.post("/payment", auth, paymentProof);
router.get("/my", auth, getMyOrders);


router.get("/owner/all", auth, getOrdersForOwner);
router.get("/owner/super-analytics", auth, superAnalytics);

// START / STOP ORDERS
router.get("/owner/status", auth, getOrderStatus);
router.post("/owner/toggle", auth, toggleOrders);

// ORDER ACTIONS
router.post("/owner/accept", auth, acceptOrder);
router.post("/owner/decline", auth, declineOrder);
router.post("/owner/status", auth, updateStatus);

module.exports = router;
