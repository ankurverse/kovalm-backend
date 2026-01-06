const express = require("express");
const router = express.Router();

const {
  subscribe,
  sendPromo,
  getPublicKey
} = require("../controllers/notificationController");

router.post("/subscribe", subscribe);
router.get("/public-key", getPublicKey);

// (Owner-only later, for now open)
router.post("/send-promo", sendPromo);

module.exports = router;
