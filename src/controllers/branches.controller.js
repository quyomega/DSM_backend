const pool = require("../services/db");

async function listBranches(req, res) {
  const { rows } = await pool.query("SELECT * FROM branches ORDER BY created_at DESC");
  res.json(rows);
}

async function createBranch(req, res) {
  const { name, address } = req.body;
  if (!name) return res.status(400).json({ error: "Missing name" });
  
  try {
    // Tạo chi nhánh mới
    const q = "INSERT INTO branches (name, address) VALUES ($1,$2) RETURNING *";
    const { rows } = await pool.query(q, [name, address || null]);
    const newBranch = rows[0];
    
    // Gắn chi nhánh cho admin (người tạo)
    const adminId = req.user.id;
    const updateUserQuery = "UPDATE users SET branch_id = $1 WHERE id = $2 RETURNING id, full_name, email, role_id, branch_id";
    const { rows: updatedUser } = await pool.query(updateUserQuery, [newBranch.id, adminId]);
    
    res.json({
      branch: newBranch,
      owner: updatedUser[0],
      message: "Chi nhánh đã được tạo "
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { listBranches, createBranch };
