const express = require("express");
const router = express.Router();

const {
  subscribe,
  sendPromo,
  getPublicKey
} = require("../controllers/notificationController");

const auth = require("../middleware/authMiddleware");
const ownerOnly = require("../middleware/ownerOnly");

router.post("/subscribe", subscribe);
router.get("/public-key", getPublicKey);

// 🔐 OWNER ONLY
router.post("/send-promo", auth, ownerOnly, sendPromo);

module.exports = router;
