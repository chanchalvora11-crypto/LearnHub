const { pool } = require('./db');

async function audit() {
    try {
        console.log("--- FULL USER AUDIT ---");
        const users = await pool.query("SELECT id, name, email FROM users");
        for (const user of users.rows) {
            const enrolls = await pool.query("SELECT COUNT(*)::int FROM enrollments WHERE user_id = $1", [user.id]);
            const progress = await pool.query("SELECT COUNT(*)::int FROM progress WHERE user_id = $1 AND is_completed = true", [user.id]);
            console.log(`ID: ${user.id} | Name: "${user.name}" | Email: ${user.email} | Enrolls: ${enrolls.rows[0].count} | Progress: ${progress.rows[0].count}`);
        }
    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
}
audit();
