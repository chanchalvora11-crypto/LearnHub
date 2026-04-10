const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function check() {
    try {
        const tables = ['courses', 'lessons', 'enrollments', 'payments', 'users', 'categories'];
        for (const t of tables) {
            const r = await pool.query(`SELECT column_name FROM information_schema.columns WHERE table_name = $1`, [t]);
            console.log(`Table ${t} Columns:`, r.rows.map(row => row.column_name).join(', '));
        }
    } catch (e) {
        console.error(e.message);
    } finally {
        await pool.end();
    }
}
check();
