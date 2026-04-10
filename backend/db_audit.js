const { pool } = require('./db');

async function audit() {
    try {
        console.log("--- USER AUDIT ---");
        const users = await pool.query("SELECT id, name, email, role FROM users");
        for (const user of users.rows) {
            const enrolls = await pool.query("SELECT COUNT(*) FROM enrollments WHERE user_id = $1", [user.id]);
            const progress = await pool.query("SELECT COUNT(*) FROM progress WHERE user_id = $1 AND is_completed = true", [user.id]);
            console.log(`User: ${user.name} (ID: ${user.id}) | Enrolls: ${enrolls.rows[0].count} | Completed Lessons: ${progress.rows[0].count}`);
        }

        console.log("\n--- RECENT ENROLLMENTS ---");
        const recent = await pool.query("SELECT e.*, u.name, c.title FROM enrollments e JOIN users u ON u.id = e.user_id JOIN courses c ON c.id = e.course_id ORDER BY e.enrolled_at DESC LIMIT 5");
        recent.rows.forEach(r => console.log(`${r.name} enrolled in ${r.title} at ${r.enrolled_at}`));

    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
}

audit();
