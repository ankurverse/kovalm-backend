const Product = require("../models/Product");

// ADD PRODUCT (OWNER)
exports.addProduct = async (req, res) => {
  try {
    const p = await Product.create(req.body);
    res.json(p);
  } catch (err) {
    res.status(500).json({ msg: "Error adding product" });
  }
};

// GET PRODUCTS (STUDENT)
exports.getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

// TOGGLE AVAILABILITY (OWNER)
exports.toggleAvailability = async (req, res) => {
  const { productId } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ msg: "Product not found" });
  }

  product.available = !product.available;
  await product.save();

  res.json({
    msg: product.available
      ? "Product enabled"
      : "Product disabled",
    available: product.available
  });
};
