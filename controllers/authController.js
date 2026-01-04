const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// =====================
// SIGNUP (unchanged)
// =====================
exports.signup = async (req, res) => {
  try {
    const { name, email, phone, roomNo, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ msg: "User already exists" });

    const hash = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      phone,
      roomNo,
      password: hash,
      role: role || "student"
    });

    res.json({ msg: "Signup Successful" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server Error" });
  }
};


// =====================
// LOGIN (FIXED ✅)
// =====================
// =====================
// LOGIN (PRODUCTION SAFE)
// =====================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Invalid credentials" });

    // 🔐 JWT with EXPIRY (12 hours)
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    res.json({
      msg: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        roomNo: user.roomNo,
        role: user.role
      }
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server Error" });
  }
};
