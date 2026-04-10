const express = require("express");
const router = express.Router();
const { pool } = require("../db");
const auth = require("../middleware/auth");

// POST /api/progress/lesson { lessonId, isCompleted }
router.post("/lesson", auth, async (req, res) => {
  const { lessonId, isCompleted = true } = req.body;

  try {
    const up = await pool.query(
      `INSERT INTO progress (user_id, lesson_id, is_completed)
       VALUES ($1,$2,$3)
       ON CONFLICT (user_id, lesson_id)
       DO UPDATE SET is_completed=EXCLUDED.is_completed, updated_at=CURRENT_TIMESTAMP
       RETURNING *`,
      [req.user.id, lessonId, isCompleted]
    );
    res.json(up.rows[0]);
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/progress/course/:courseId  -> progress %
router.get("/course/:courseId", auth, async (req, res) => {
  const courseId = req.params.courseId;

  try {
    const totalLessons = await pool.query(
      `SELECT COUNT(*)::int AS total FROM lessons WHERE course_id=$1`,
      [courseId]
    );

    const completedLessons = await pool.query(
      `SELECT COUNT(*)::int AS done
       FROM progress p
       JOIN lessons l ON l.id=p.lesson_id
       WHERE p.user_id=$1 AND l.course_id=$2 AND p.is_completed=true`,
      [req.user.id, courseId]
    );

    const total = totalLessons.rows[0]?.total || 0;
    const done = completedLessons.rows[0]?.done || 0;
    const percent = total === 0 ? 0 : Math.round((done / total) * 100);

    res.json({ total, done, percent });
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
