const Product = require("../models/Product");

/* ============================
   STUDENT → GET PRODUCTS
============================ */
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch products" });
  }
};

/* ============================
   OWNER → GET ALL PRODUCTS
============================ */
exports.getAllProductsForOwner = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch products" });
  }
};

/* ============================
   OWNER → ADD PRODUCT
============================ */
exports.addProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      image,
      category,
      available: true
    });

    res.json({ msg: "Product added", product });
  } catch (err) {
    res.status(500).json({ msg: "Error adding product" });
  }
};

/* ============================
   OWNER → UPDATE PRODUCT
============================ */
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.json({ msg: "Product updated", product });
  } catch (err) {
    res.status(500).json({ msg: "Error updating product" });
  }
};

/* ============================
   OWNER → DELETE PRODUCT
============================ */
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.json({ msg: "Product deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting product" });
  }
};

/* ============================
   OWNER → TOGGLE AVAILABILITY
============================ */
exports.toggleAvailability = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    product.available = !product.available;
    await product.save();

    res.json({
      msg: product.available ? "Product enabled" : "Product disabled",
      available: product.available
    });
  } catch (err) {
    res.status(500).json({ msg: "Error toggling availability" });
  }
};
