const express = require("express");
const router = express.Router();
const { pool } = require("../db");
const auth = require("../middleware/auth");

// GET /api/profile/me
router.get("/me", auth, async (req, res) => {
  try {
    const u = await pool.query(
      `SELECT id, name, email, role, created_at FROM users WHERE id=$1`,
      [req.user.id]
    );
    res.json(u.rows[0]);
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
