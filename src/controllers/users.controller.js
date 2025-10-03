const pool = require("../services/db");
const bcrypt = require("bcryptjs");

// admin/manager có thể list users; manager nên chỉ xem trong branch (check ở route)
async function listUsers(req, res) {
  try {
    // nếu manager -> lọc theo branch_id
    if (req.user.role_name === "manager") {
      const branchId = req.user.branch_id;
      const { rows } = await pool.query("SELECT id, full_name, email, phone, role_id, branch_id FROM users WHERE branch_id = $1", [branchId]);
      return res.json(rows);
    }
    const { rows } = await pool.query("SELECT id, full_name, email, phone, role_id, branch_id FROM users");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createUser(req, res) {
  const { full_name, email, password, phone, role_id, branch_id } = req.body;
  if (!full_name || !email || !password) return res.status(400).json({ error: "Missing fields" });
  try {
    const hashed = await bcrypt.hash(password, 10);
    const q = `INSERT INTO users (full_name, email, password, phone, role_id, branch_id) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, full_name, email, role_id, branch_id`;
    const { rows } = await pool.query(q, [full_name, email, hashed, phone || null, role_id || 3, branch_id || null]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteUser(req, res) {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { listUsers, createUser, deleteUser };
