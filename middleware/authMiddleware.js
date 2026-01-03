const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1️⃣ No header
  if (!authHeader) {
    return res.status(401).json({ msg: "Authorization header missing" });
  }

  // 2️⃣ Must start with Bearer
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Invalid authorization format" });
  }

  // 3️⃣ Extract token
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};
