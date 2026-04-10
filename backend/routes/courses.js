const express = require("express");
const router = express.Router();
const { pool } = require("../db");

// GET /api/courses?search=&category_id=&min_price=&max_price=
router.get("/", async (req, res) => {
  const { search = "", category_id, min_price, max_price } = req.query;

  const params = [];
  let where = "WHERE 1=1";

  if (search) {
    params.push(`%${search}%`);
    where += ` AND (title ILIKE $${params.length} OR description ILIKE $${params.length})`;
  }
  if (category_id) {
    params.push(category_id);
    where += ` AND category_id = $${params.length}`;
  }
  if (min_price) {
    params.push(min_price);
    where += ` AND price >= $${params.length}`;
  }
  if (max_price) {
    params.push(max_price);
    where += ` AND price <= $${params.length}`;
  }

  try {
    const q = `
      SELECT co.*,
        u.name as instructor_name,
        c.name as category_name
      FROM courses co
      LEFT JOIN users u ON u.id = co.instructor_id
      LEFT JOIN categories c ON c.id = co.category_id
      ${where}
      ORDER BY co.id DESC
      LIMIT 100
    `;
    const result = await pool.query(q, params);
    res.json(result.rows);
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const courseId = req.params.id;

    const course = await pool.query(
      `SELECT co.*, u.name as instructor_name, c.name as category_name
       FROM courses co
       LEFT JOIN users u ON u.id = co.instructor_id
       LEFT JOIN categories c ON c.id = co.category_id
       WHERE co.id=$1`,
      [courseId]
    );

    const materials = await pool.query(
      `SELECT * FROM course_materials WHERE course_id=$1`,
      [courseId]
    );

    const lessons = await pool.query(
      `SELECT * FROM lessons WHERE course_id=$1 ORDER BY order_number`,
      [courseId]
    );

    res.json({
      course: course.rows[0],
      lessons: lessons.rows,
      materials: materials.rows
    });
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
