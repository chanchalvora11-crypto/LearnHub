const express = require("express");
const router = express.Router();
const { pool } = require("../db");
const auth = require("../middleware/auth");

// POST /api/enrollments { courseId }
router.post("/", auth, async (req, res) => {
  const { courseId } = req.body;
  try {
    const existing = await pool.query(
      `SELECT * FROM enrollments WHERE user_id=$1 AND course_id=$2`,
      [req.user.id, courseId]
    );
    if (existing.rows.length) return res.status(400).json({ message: "Already enrolled" });

    const enrolled = await pool.query(
      `INSERT INTO enrollments (user_id, course_id) VALUES ($1,$2) RETURNING *`,
      [req.user.id, courseId]
    );
    res.status(201).json(enrolled.rows[0]);
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/enrollments/my
router.get("/my", auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT e.*, co.title, co.price, co.description, co.category_id, cat.name as category_name
       FROM enrollments e
       JOIN courses co ON co.id=e.course_id
       LEFT JOIN categories cat ON cat.id=co.category_id
       WHERE e.user_id=$1
       ORDER BY e.enrolled_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
