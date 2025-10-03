const jwt = require("jsonwebtoken");
require("dotenv").config();
const pool = require("../services/db");

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "8h" });
}

async function authenticate(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });
  const token = auth.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // gắn user info vào req (có thể lấy thêm từ DB)
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// middleware kiểm tra role (có thể truyền list roles cho phép)
function permit(...allowedRoles) {
  return (req, res, next) => {
    const role = req.user && req.user.role_name;
    if (!role || !allowedRoles.includes(role)) return res.status(403).json({ error: "Forbidden" });
    next();
  };
}

module.exports = { signToken, authenticate, permit };
