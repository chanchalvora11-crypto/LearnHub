const { Pool } = require('pg');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const pool = new Pool({
    user: process.env.DB_USER, host: process.env.DB_HOST,
    database: process.env.DB_NAME, password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function run() {
    try {
        const tbls = ['users', 'courses', 'categories', 'lessons', 'enrollments', 'payments'];
        let out = '';
        for (const t of tbls) {
            const r = await pool.query(`SELECT column_name FROM information_schema.columns WHERE table_name = $1`, [t]);
            const cols = r.rows.map(row => row.column_name).join(', ');
            out += `Table [${t}]: ${cols}\n`;
        }
        fs.writeFileSync('schema_audit.txt', out);
        console.log("Audit complete. Read schema_audit.txt");
    } catch (e) {
        console.error(e.message);
    } finally {
        await pool.end();
    }
}
run();
