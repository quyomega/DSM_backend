const pool = require("../services/db");

async function listShifts(req, res) {
  const { rows } = await pool.query("SELECT * FROM shifts ORDER BY created_at DESC");
  res.json(rows);
}

async function createShift(req, res) {
  const { shift_name, start_time, end_time } = req.body;
  if (!shift_name || !start_time || !end_time) return res.status(400).json({ error: "Missing fields" });
  const q = "INSERT INTO shifts (shift_name, start_time, end_time) VALUES ($1,$2,$3) RETURNING *";
  const { rows } = await pool.query(q, [shift_name, start_time, end_time]);
  res.json(rows[0]);
}

module.exports = { listShifts, createShift };
