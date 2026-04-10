const express = require("express");
const router = express.Router();
const { pool } = require("../db");
const auth = require("../middleware/auth");

// GET /api/stats/me
router.get("/me", auth, async (req, res) => {
    try {
        const userId = req.user.id;
        console.log(`[DEBUG] Received stats request for userId: ${userId}`);

        // Verify user exists in DB
        const userCheck = await pool.query("SELECT id, name FROM users WHERE id = $1", [userId]);
        if (userCheck.rows.length === 0) {
            console.log(`[DEBUG] CRITICAL: userId ${userId} from token NOT FOUND in database!`);
        } else {
            console.log(`[DEBUG] userId ${userId} is confirmed as ${userCheck.rows[0].name}`);
        }

        // Count enrolled courses
        const enrollmentCount = await pool.query(
            "SELECT COUNT(*)::int AS count FROM enrollments WHERE user_id = $1",
            [userId]
        );
        console.log(`[DEBUG] Enrollment count for ${userId}: ${enrollmentCount.rows[0].count}`);

        // Count completed lessons
        let completedLessonsCount = { rows: [{ count: 0 }] };
        try {
            completedLessonsCount = await pool.query(
                `SELECT COUNT(*)::int AS count 
                 FROM progress 
                 WHERE user_id = $1 AND is_completed = true`,
                [userId]
            );
        } catch (err) {
            console.log("Progress table might be missing, returning 0");
        }

        // Get dynamic skill progress from database
        const skillProgressQuery = await pool.query(
            `SELECT 
                cat.name as label,
                COUNT(l.id) as total,
                COUNT(p.id) filter (where p.is_completed = true) as done
             FROM enrollments e
             JOIN courses c ON c.id = e.course_id
             JOIN categories cat ON cat.id = c.category_id
             JOIN lessons l ON l.course_id = c.id
             LEFT JOIN progress p ON p.lesson_id = l.id AND p.user_id = e.user_id
             WHERE e.user_id = $1
             GROUP BY cat.name`,
            [userId]
        );

        let skillProgress = skillProgressQuery.rows.map(r => ({
            label: r.label,
            progress: r.total == 0 ? 0 : Math.round((parseInt(r.done) / parseInt(r.total)) * 100)
        }));

        // If no progress, show empty but labeled categories for UI "WOW" Factor
        if (skillProgress.length === 0) {
            skillProgress = [
                { label: "Frontend Development", progress: 0 },
                { label: "UI/UX Design", progress: 0 },
                { label: "Backend Engineering", progress: 0 },
                { label: "Data Science", progress: 0 },
            ];
        }

        // Instructor Stats (if they are an instructor)
        let instructorStats = null;
        if (req.user.role === 'instructor') {
            const coursesRes = await pool.query("SELECT id FROM courses WHERE instructor_id = $1", [userId]);
            const courseIds = coursesRes.rows.map(r => r.id);

            if (courseIds.length > 0) {
                const studentsRes = await pool.query("SELECT COUNT(DISTINCT user_id)::int AS count FROM enrollments WHERE course_id = ANY($1)", [courseIds]);
                const revenueRes = await pool.query("SELECT SUM(amount)::int AS total FROM payments WHERE course_id = ANY($1)", [courseIds]);

                instructorStats = {
                    totalStudents: studentsRes.rows[0].count,
                    totalRevenue: revenueRes.rows[0].total || 0,
                    activeCourses: courseIds.length
                };
            } else {
                instructorStats = { totalStudents: 0, totalRevenue: 0, activeCourses: 0 };
            }
        }

        // Per-Course Progress for Charts
        const courseProgressQuery = await pool.query(
            `SELECT 
                c.id, 
                c.title,
                COUNT(l.id) as total_lessons,
                COUNT(p.id) filter (where p.is_completed = true) as completed_lessons
             FROM enrollments e
             JOIN courses c ON c.id = e.course_id
             LEFT JOIN lessons l ON l.course_id = c.id
             LEFT JOIN progress p ON p.lesson_id = l.id AND p.user_id = e.user_id
             WHERE e.user_id = $1
             GROUP BY c.id, c.title`,
            [userId]
        );

        const courseStats = courseProgressQuery.rows.map(r => ({
            title: r.title,
            completed: parseInt(r.completed_lessons),
            total: parseInt(r.total_lessons),
            score: parseInt(r.completed_lessons) * 50 // 50 points per lesson
        }));

        res.json({
            enrolledCourseCount: enrollmentCount.rows[0].count,
            completedLessonCount: completedLessonsCount.rows[0].count,
            points: enrollmentCount.rows[0].count * 150 + completedLessonsCount.rows[0].count * 50,
            skillProgress: skillProgress,
            instructorStats: instructorStats,
            courseStats: courseStats,
            active_version: "DYNAMIC_V2"
        });
    } catch (e) {
        console.error(e.message);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
