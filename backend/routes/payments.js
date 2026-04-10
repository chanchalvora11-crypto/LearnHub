const express = require("express");
const router = express.Router();
const { pool } = require("../db");
const auth = require("../middleware/auth");

// POST /api/payments/mockPay { courseId }
router.post("/mockPay", auth, async (req, res) => {
  const { courseId } = req.body;

  try {
    const course = await pool.query(`SELECT price FROM courses WHERE id=$1`, [courseId]);
    if (!course.rows.length) return res.status(404).json({ message: "Course not found" });

    const amount = course.rows[0].price;

    const payment = await pool.query(
      `INSERT INTO payments (user_id, course_id, amount, status, method, transaction_ref, paid_at)
       VALUES ($1,$2,$3,'success','mock',$4,CURRENT_TIMESTAMP)
       RETURNING *`,
      [req.user.id, courseId, amount, `MOCK_${Date.now()}`]
    );

    res.status(201).json(payment.rows[0]);
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/payments/my
router.get("/my", auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, co.title
       FROM payments p
       JOIN courses co ON co.id=p.course_id
       WHERE p.user_id=$1
       ORDER BY p.id DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
