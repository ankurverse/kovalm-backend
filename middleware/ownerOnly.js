module.exports = (req, res, next) => {
  if (!req.user || req.user.role !== "owner") {
    return res.status(403).json({ msg: "Owner access only" });
  }
  next();
};
