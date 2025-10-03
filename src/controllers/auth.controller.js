const pool = require("../services/db");
const bcrypt = require("bcryptjs");
const { signToken } = require("../middleware/auth");

const SALT_ROUNDS = 10;

async function register(req, res) {
  const { full_name, email, password, phone, role_id, branch_id, tax_code } = req.body;
  if (!email || !password || !full_name) 
    return res.status(400).json({ error: "Missing fields" });

  // Nếu là chủ công ty (Admin)
  if (role_id === 1) {
    if (!phone) return res.status(400).json({ error: "Số điện thoại là bắt buộc cho chủ công ty" });
    if (!tax_code) return res.status(400).json({ error: "Mã số thuế là bắt buộc cho chủ công ty" });
  }

  try {
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const q = `INSERT INTO users (full_name, email, password, phone, role_id, branch_id, tax_code)
               VALUES ($1,$2,$3,$4,$5,$6,$7) 
               RETURNING id, full_name, email, role_id, branch_id, tax_code`;
    const { rows } = await pool.query(q, [
      full_name, 
      email, 
      hashed, 
      phone || null, 
      role_id || 3, 
      branch_id || null, 
      tax_code || null
    ]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Missing fields" });
  try {
    const { rows } = await pool.query("SELECT u.*, r.role_name FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE email=$1", [email]);
    if (!rows[0]) return res.status(400).json({ error: "Invalid credentials" });
    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password || "");
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });
    // tạo token với payload id, role_name, branch_id
    const token = signToken({ id: user.id, role_name: user.role_name, branch_id: user.branch_id });
    res.json({ token, user: { id: user.id, email: user.email, full_name: user.full_name, role_name: user.role_name, branch_id: user.branch_id } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { register, login };
