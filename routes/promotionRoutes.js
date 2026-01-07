const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const ownerOnly = require("../middleware/ownerOnly");

const {
  getPromotions,
  addPromotion,
  deletePromotion
} = require("../controllers/promotionController");

// Student – fetch posters
router.get("/", getPromotions);

// Owner – add poster
router.post("/", auth, ownerOnly, addPromotion);

// Owner – delete poster
router.delete("/:id", auth, ownerOnly, deletePromotion);

module.exports = router;
