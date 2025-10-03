const pool = require("../services/db");

// lấy lịch theo user hoặc toàn bộ (admin/manager)
async function listSchedules(req, res) {
  try {
    if (req.user.role_name === "employee") {
      const { rows } = await pool.query(
        `SELECT s.*, sh.shift_name, u.full_name
         FROM schedules s
         JOIN shifts sh ON s.shift_id = sh.id
         JOIN users u ON s.user_id = u.id
         WHERE s.user_id = $1
         ORDER BY s.work_date`,
        [req.user.id]
      );
      return res.json(rows);
    }
    // manager -> lọc branch
    if (req.user.role_name === "manager") {
      const { rows } = await pool.query(
        `SELECT s.*, sh.shift_name, u.full_name FROM schedules s
         JOIN shifts sh ON s.shift_id = sh.id
         JOIN users u ON s.user_id = u.id
         WHERE u.branch_id = $1
         ORDER BY s.work_date`,
        [req.user.branch_id]
      );
      return res.json(rows);
    }
    // admin
    const { rows } = await pool.query(
      `SELECT s.*, sh.shift_name, u.full_name FROM schedules s
       JOIN shifts sh ON s.shift_id = sh.id
       JOIN users u ON s.user_id = u.id
       ORDER BY s.work_date`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// manager/admin tạo lịch cho user
async function createSchedule(req, res) {
  const { user_id, shift_id, work_date } = req.body;
  if (!user_id || !shift_id || !work_date) return res.status(400).json({ error: "Missing fields" });
  try {
    const q = `INSERT INTO schedules (user_id, shift_id, work_date) VALUES ($1,$2,$3) RETURNING *`;
    const { rows } = await pool.query(q, [user_id, shift_id, work_date]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { listSchedules, createSchedule };
