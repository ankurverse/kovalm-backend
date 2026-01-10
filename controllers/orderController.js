const Settings = require("../models/Settings");
const Order = require("../models/Order");
const Product = require("../models/Product"); // ✅ ADD THIS

/* ============================
   STUDENT → PAYMENT CREATES ORDER
============================ */
exports.paymentProof = async (req, res) => {
  try {
    // 🔴 CHECK IF CAFE IS OPEN
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});

    if (!settings.isAcceptingOrders) {
      return res.status(403).json({
        msg: "Cafe is currently not accepting orders"
      });
    }

    const userId = req.user.id;

    const {
      items,
      subtotal,
      total,
      roomNo,
      utr,
      name,
      phone
    } = req.body;

    // 🔴 PREVENT MULTIPLE ACTIVE ORDERS
    const active = await Order.findOne({
      userId,
      status: { $nin: ["delivered", "declined"] }
    });

    if (active) {
      return res.status(400).json({
        msg: "You already have an active order"
      });
    }

    // ==============================
    // 🔥 INVENTORY VALIDATION & UPDATE
    // ==============================
    for (const cartItem of items) {
      const product = await Product.findById(cartItem._id);

      if (!product) {
        return res.status(400).json({
          msg: `Product not found`
        });
      }

      if (!product.available || product.quantity <= 0) {
        return res.status(400).json({
          msg: `${product.name} is out of stock`
        });
      }

      if (cartItem.qty > product.quantity) {
        return res.status(400).json({
          msg: `Only ${product.quantity} quantity left for ${product.name}`
        });
      }

      // 🔻 DEDUCT QUANTITY
      product.quantity -= cartItem.qty;

      // 🔴 AUTO DISABLE IF ZERO
      if (product.quantity === 0) {
        product.available = false;
      }

      await product.save();
    }

    // ==============================
    // ✅ CREATE ORDER
    // ==============================
    const order = await Order.create({
      userId,
      items,
      subtotal,
      totalAmount: total,
      roomNo,
      transactionId: utr,
      customerName: name,
      customerPhone: phone,
      paymentStatus: "verifying",
      status: "pending"
    });

    res.json({
      msg: "Payment received. Order placed successfully.",
      orderId: order._id
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
};




/* ============================
   OWNER → GET ALL ORDERS
============================ */
exports.getOrdersForOwner = async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
};


/* ============================
   OWNER → ACCEPT ORDER
============================ */
exports.acceptOrder = async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ msg: "Order not found" });

  if (["declined", "delivered"].includes(order.status)) {
    return res.status(400).json({ msg: "Order already closed" });
  }

  order.status = "accepted";
  order.paymentStatus = "paid";
  await order.save();

  res.json({ msg: "Order accepted" });
};


/* ============================
   OWNER → DECLINE ORDER
============================ */
exports.declineOrder = async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ msg: "Order not found" });

  if (order.status === "declined") {
    return res.status(400).json({ msg: "Order already declined" });
  }

  if (order.status === "delivered") {
    return res.status(400).json({ msg: "Delivered order cannot be declined" });
  }

  order.status = "declined";
  order.paymentStatus = "failed";
  await order.save();

  res.json({ msg: "Order declined" });
};


/* ============================
   OWNER → UPDATE STATUS
============================ */
exports.updateStatus = async (req, res) => {
  const { orderId, status } = req.body;

  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ msg: "Order not found" });

  if (["declined", "delivered"].includes(order.status)) {
    return res.status(400).json({ msg: "Closed orders cannot be updated" });
  }

  const allowedFlow = {
    accepted: ["preparing"],
    preparing: ["outForDelivery"],
    outForDelivery: ["delivered"]
  };

  if (!allowedFlow[order.status]?.includes(status)) {
    return res.status(400).json({
      msg: `Invalid status transition`
    });
  }

  order.status = status;
  await order.save();

  res.json({ msg: "Status updated" });
};


/* ============================
   STUDENT → MY ORDERS
============================ */
exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({
    userId: req.user.id
  }).sort({ createdAt: -1 });

  res.json(orders);
};


/* ============================
   OWNER → SUPER ANALYTICS
============================ */
exports.superAnalytics = async (req, res) => {
  try {
    const orders = await Order.find();

    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;

    const todayStart = new Date(
      new Date(now.getTime() + istOffset).setHours(0,0,0,0) - istOffset
    );

    const todayEnd = new Date(
      new Date(now.getTime() + istOffset).setHours(23,59,59,999) - istOffset
    );

    const monthStart = new Date(
      new Date(now.getTime() + istOffset).getFullYear(),
      new Date(now.getTime() + istOffset).getMonth(),
      1
    );

    const todayOrders = orders.filter(o =>
      new Date(o.createdAt) >= todayStart &&
      new Date(o.createdAt) <= todayEnd
    );

    const monthOrders = orders.filter(o =>
      new Date(o.createdAt) >= monthStart
    );

    const deliveredToday = todayOrders.filter(o => o.status === "delivered");
    const deliveredMonth = monthOrders.filter(o => o.status === "delivered");

    const sum = arr => arr.reduce((s,o)=> s + (o.totalAmount || 0), 0);

    res.json({
      count: {
        total: orders.length,
        delivered: orders.filter(o => o.status === "delivered").length,
        declined: orders.filter(o => o.status === "declined").length,
        pending: orders.filter(o => !["delivered","declined"].includes(o.status)).length
      },
      today: {
        orders: todayOrders.length,
        earning: sum(deliveredToday)
      },
      month: {
        orders: monthOrders.length,
        earning: sum(deliveredMonth)
      }
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Analytics error" });
  }
};



/* ============================
   OWNER → GET ORDER STATUS
============================ */
exports.getOrderStatus = async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({});
  res.json(settings);
};


/* ============================
   OWNER → TOGGLE ORDERS
============================ */
exports.toggleOrders = async (req, res) => {
  const { isAcceptingOrders } = req.body;

  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({});

  settings.isAcceptingOrders = isAcceptingOrders;
  await settings.save();

  res.json({
    msg: isAcceptingOrders
      ? "Orders are now OPEN"
      : "Orders are now CLOSED"
  });
};

// ============================
// STUDENT → CHECK CART STOCK BEFORE PAYMENT
// ============================
exports.validateCartStock = async (req, res) => {
  try {
    const { items } = req.body;

    for (const cartItem of items) {
      const product = await Product.findById(cartItem._id);

      if (!product || product.quantity <= 0) {
        return res.status(400).json({
          msg: `${cartItem.name} is out of stock`
        });
      }

      if (cartItem.qty > product.quantity) {
        return res.status(400).json({
          msg: `Only ${product.quantity} left for ${product.name}`
        });
      }
    }

    res.json({ ok: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Stock validation failed" });
  }
};
