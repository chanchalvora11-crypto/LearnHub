const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const pool = new Pool({
    user: process.env.DB_USER, host: process.env.DB_HOST,
    database: process.env.DB_NAME, password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function run() {
    try {
        const q = `
          SELECT co.*, u.name as instructor_name, c.name as category_name
          FROM courses co
          LEFT JOIN users u ON u.id = co.instructor_id
          LEFT JOIN categories c ON c.id = co.category_id
          WHERE 1=1
          ORDER BY co.id DESC
          LIMIT 100
        `;
        const res = await pool.query(q);
        console.log("SUCCESS! Rows:", res.rows.length);
    } catch (e) {
        console.error("QUERY ERROR:", e.message);
    } finally {
        await pool.end();
    }
}
run();
