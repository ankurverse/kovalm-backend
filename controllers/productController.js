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
    const { name, description, price, image, category, quantity } = req.body;


    const product = await Product.create({
  name,
  description,
  price,
  image,
  category,
  quantity: quantity || 0,
  available: quantity > 0
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

exports.updateStock = async (req, res) => {
  try {
    const { productId, change } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    product.quantity += change;
    if (product.quantity < 0) product.quantity = 0;

    product.available = product.quantity > 0;

    await product.save();

    res.json({
      msg: "Stock updated",
      quantity: product.quantity,
      available: product.available
    });

  } catch (err) {
    res.status(500).json({ msg: "Failed to update stock" });
  }
};

const XLSX = require("xlsx");
const Product = require("../models/Product");

exports.updateStockFromExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "Excel file required" });
    }

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    let updated = 0;
    let skipped = 0;

    for (const row of rows) {
      const name = row.name?.trim();
      const price = Number(row.price);
      const quantity = Number(row.quantity);

      if (!name || !price || quantity <= 0) {
        skipped++;
        continue;
      }

      // 🔒 STRICT MATCH: name + price
      const product = await Product.findOne({ name, price });

      if (!product) {
        skipped++;
        continue; // ❌ DO NOT CREATE PRODUCT
      }

      product.quantity += quantity;
      product.available = product.quantity > 0;

      await product.save();
      updated++;
    }

    res.json({
      msg: "Stock updated successfully",
      updated,
      skipped
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Excel stock update failed" });
  }
};
