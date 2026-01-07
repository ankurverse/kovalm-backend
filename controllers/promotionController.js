const Promotion = require("../models/Promotion");

// STUDENT → get posters
exports.getPromotions = async (req, res) => {
  const promos = await Promotion.find({ active: true })
    .sort({ createdAt: -1 });
  res.json(promos);
};

// OWNER → add poster
exports.addPromotion = async (req, res) => {
  const { image } = req.body;
  await Promotion.create({ image });
  res.json({ msg: "Promotion added" });
};

// OWNER → delete poster
exports.deletePromotion = async (req, res) => {
  await Promotion.findByIdAndDelete(req.params.id);
  res.json({ msg: "Promotion removed" });
};
