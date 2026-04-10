const { pool } = require('./db');

async function check() {
    try {
        const userRes = await pool.query("SELECT id, name, role FROM users WHERE name ILIKE $1", ['Chanchal']);
        if (userRes.rows.length === 0) {
            console.log("User 'Chanchal' not found.");
            return;
        }
        const user = userRes.rows[0];
        console.log(`Checking stats for User: ${user.name} (ID: ${user.id}, Role: ${user.role})`);

        const enrollments = await pool.query("SELECT e.*, c.title FROM enrollments e JOIN courses c ON c.id = e.course_id WHERE e.user_id = $1", [user.id]);
        console.log(`Enrollment Count: ${enrollments.rows.length}`);
        enrollments.rows.forEach(e => console.log(`- Enrolled in: ${e.title} at ${e.enrolled_at}`));

        const statsRes = await pool.query(`
            SELECT 
                COUNT(*)::int AS count 
            FROM enrollments 
            WHERE user_id = $1
        `, [user.id]);
        console.log(`Stats Query Count: ${statsRes.rows[0].count}`);

    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
}

check();
