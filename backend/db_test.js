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

async function test() {
    try {
        console.log("Attempting to connect with:", {
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT
        });
        const res = await pool.query('SELECT NOW()');
        console.log("Connection successful! Time from DB:", res.rows[0].now);

        const courses = await pool.query('SELECT COUNT(*) FROM courses');
        console.log("Course Count:", courses.rows[0].count);

        const users = await pool.query('SELECT id, name, email FROM users');
        console.log("Users in DB:", users.rows);
    } catch (err) {
        console.error("CONNECTION ERROR:", err.message);
        if (err.message.includes("SASL")) {
            console.log("HINT: Try updating the 'pg' package or check if your Postgres password matches.");
        }
    } finally {
        await pool.end();
    }
}

test();
