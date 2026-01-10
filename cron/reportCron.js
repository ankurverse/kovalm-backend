const cron = require("node-cron");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { sendEmail } = require("../utils/emailService");

// 🌙 DAILY REPORT (11:59 PM IST)
cron.schedule("* * * * *", async () => {

  const todayStart = new Date();
  todayStart.setHours(0,0,0,0);

  const todayEnd = new Date();
  todayEnd.setHours(23,59,59,999);

  const orders = await Order.find({
    createdAt: { $gte: todayStart, $lte: todayEnd }
  });

  const delivered = orders.filter(o => o.status === "delivered");
  const pending = orders.filter(o => o.status === "pending");
  const declined = orders.filter(o => o.status === "declined");

  const earnings = delivered.reduce((s,o)=>s+(o.totalAmount||0),0);

  const lowStock = await Product.find({ quantity: { $lte: 5 } });

  let html = `
    <h2>📊 Daily Report – JBD Mart</h2>
    <p><b>Total Orders:</b> ${orders.length}</p>
    <p>✅ Delivered: ${delivered.length}</p>
    <p>⏳ Pending: ${pending.length}</p>
    <p>❌ Declined: ${declined.length}</p>
    <p><b>💰 Earnings:</b> ₹${earnings}</p>

    <h3>⚠️ Low Stock Items</h3>
    <ul>
      ${lowStock.map(p => `<li>${p.name} – ${p.quantity} left</li>`).join("")}
    </ul>
  `;

  await sendEmail("📅 Daily Report – JBD Mart", html);
});

// 📆 MONTHLY REPORT (Last day, 11:59 PM)
cron.schedule("59 23 28-31 * *", async () => {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  if (now.getDate() !== lastDay) return;

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const orders = await Order.find({ createdAt: { $gte: monthStart } });
  const revenue = orders.reduce((s,o)=>s+(o.totalAmount||0),0);

  const products = await Product.find();

  let html = `
    <h2>📆 Monthly Report – JBD Mart</h2>
    <p><b>Total Orders:</b> ${orders.length}</p>
    <p><b>Total Revenue:</b> ₹${revenue}</p>

    <h3>📦 Stock Summary</h3>
    <ul>
      ${products.map(p => `<li>${p.name} – ${p.quantity}</li>`).join("")}
    </ul>
  `;

  await sendEmail("📆 Monthly Report – JBD Mart", html);
});
