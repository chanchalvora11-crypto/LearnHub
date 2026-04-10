const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function findData() {
    try {
        const courses = await pool.query("SELECT * FROM courses");
        console.log(`Found ${courses.rows.length} courses.`);

        const payments = await pool.query("SELECT * FROM payments");
        console.log(`Found ${payments.rows.length} payments.`);

        const enrollments = await pool.query("SELECT * FROM enrollments");
        console.log(`Found ${enrollments.rows.length} enrollments.`);

        if (courses.rows.length > 0) {
            console.log("Example Course Title:", courses.rows[0].title);
        }
    } catch (e) {
        console.error(e.message);
    } finally {
        const res = await pool.end();
    }
}

findData();
