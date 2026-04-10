const { Pool } = require("pg");
require("dotenv").config();
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function checkCols() {
    try {
        const r = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'lessons'");
        console.log("Lessons Columns:", r.rows.map(row => row.column_name));
    } catch (e) {
        console.error(e.message);
    } finally {
        await pool.end();
    }
}
checkCols();
