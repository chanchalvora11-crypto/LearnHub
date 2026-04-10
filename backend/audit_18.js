const { pool } = require('./db');
async function check() {
    try {
        const res = await pool.query("SELECT e.*, c.title FROM enrollments e JOIN courses c ON c.id = e.course_id WHERE e.user_id = 18");
        console.log(`User 18 Enrollments (${res.rows.length}):`);
        res.rows.forEach(r => console.log(`- ${r.title}`));

        const res2 = await pool.query("SELECT * FROM progress WHERE user_id = 18");
        console.log(`User 18 Progress Records: ${res2.rows.length}`);
    } catch (e) { console.error(e); } finally { pool.end(); }
}
check();
