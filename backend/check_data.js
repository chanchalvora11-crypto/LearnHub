const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function checkData() {
  try {
    const users = await pool.query('SELECT COUNT(*) FROM users');
    const categories = await pool.query('SELECT COUNT(*) FROM categories');
    const courses = await pool.query('SELECT COUNT(*) FROM courses');
    
    console.log('Users:', users.rows[0].count);
    console.log('Categories:', categories.rows[0].count);
    console.log('Courses:', courses.rows[0].count);
    
    const queryTest = await pool.query(`
      SELECT c.*, u.name as instructor_name, cat.name as category_name 
      FROM courses c
      JOIN users u ON c.instructor_id = u.id
      JOIN categories cat ON c.category_id = cat.id
    `);
    console.log('Query Result Rows:', queryTest.rows.length);
    if (queryTest.rows.length > 0) {
      console.log('First Title:', queryTest.rows[0].title);
    }

    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

checkData();
