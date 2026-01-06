const webpush = require("web-push");
const Subscriber = require("../models/Subscriber");

// 🔐 VAPID CONFIG
webpush.setVapidDetails(
  "mailto:admin@collegecart.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// 📤 SEND PROMOTIONAL NOTIFICATION
exports.sendPromo = async (req, res) => {
  try {
    const { title, body } = req.body;

    const subscribers = await Subscriber.find();

    const payload = JSON.stringify({
      title,
      body,
      url: "/"
    });

    subscribers.forEach(sub => {
      webpush.sendNotification(sub, payload).catch(err => {
        console.error("Push failed:", err.message);
      });
    });

    res.json({ msg: "Notification sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Notification error" });
  }
};

// 🔓 PUBLIC KEY FOR FRONTEND
exports.getPublicKey = (req, res) => {
  res.json({
    publicKey: process.env.VAPID_PUBLIC_KEY
  });
};

// 📥 SAVE SUBSCRIPTION
exports.subscribe = async (req, res) => {
  try {
    const subscription = req.body;

    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ msg: "Invalid subscription" });
    }

    const exists = await Subscriber.findOne({
      endpoint: subscription.endpoint
    });

    if (!exists) {
      await Subscriber.create(subscription);
    }

    res.json({ msg: "Subscribed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Subscription failed" });
  }
};
