const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  console.log(1, req.header("x-auth-token"));
  const token = req.header("x-auth-token");
  if (!token) {
    res.status(401).json({ msg: "NO token. Auth Failed" });
  }
  try {
    console.log(token);
    const decoded = jwt.verify(token, config.get("JWTSecretCampus"));
    req.campus = decoded.campus;
    console.log(14, req.campus);
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ msg: "Token is not valid" });
  }
};
