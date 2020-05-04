const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("auth-token");
  console.log(token);
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const verified = jwt.verify(token, process.env.SECRET_TOKEN);
    req.user = verified.user;
    next();
  } catch (error) {
    return res.status(400).json({ msg: "Invalid token" });
  }
};
