const { Pool } = require("pg");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function check() {
    try {
        console.log("Checking database:", process.env.DB_NAME);
        const r = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
        console.log("Tables found:", r.rows.map(row => row.table_name));
    } catch (e) {
        console.error("Error:", e.message);
    } finally {
        await pool.end();
    }
}

check();
