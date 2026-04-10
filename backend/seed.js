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

const seed = async () => {
    try {
        console.log("Seeding database...");

        // 1. Insert Categories
        const categories = [
            "Web Development",
            "UI/UX Design",
            "Mobile Development",
            "Cloud Computing",
        ];
        for (const cat of categories) {
            await pool.query(
                "INSERT INTO categories (name) VALUES ($1) ON CONFLICT DO NOTHING",
                [cat]
            );
        }
        console.log("Categories seeded.");

        const catResult = await pool.query("SELECT id FROM categories LIMIT 1");
        const categoryId = catResult.rows[0].id;

        // 2. Insert dummy instructor if none exists
        const instructorResult = await pool.query("SELECT id FROM users WHERE role='instructor' LIMIT 1");
        let instructorId;
        if (instructorResult.rows.length === 0) {
            // Just use any existing user or create one
            const anyUser = await pool.query("SELECT id FROM users LIMIT 1");
            if (anyUser.rows.length > 0) {
                instructorId = anyUser.rows[0].id;
                await pool.query("UPDATE users SET role='instructor' WHERE id=$1", [instructorId]);
            } else {
                // This is unlikely as user is logged in, but let's be safe
                console.log("No users found to assign as instructor.");
                return;
            }
        } else {
            instructorId = instructorResult.rows[0].id;
        }

        // 3. Insert Courses
        const courses = [
            {
                title: "Mastering React Animations",
                description: "Learn how to build premium animated interfaces with Framer Motion and React.",
                price: 499,
                category_id: categoryId,
                instructor_id: instructorId,
                image_url: "https://images.unsplash.com/photo-1633356122544-f134324a6cee"
            },
            {
                title: "Full-Stack Node.js Guide",
                description: "Comprehensive guide to building scalable backends with Express and PostgreSQL.",
                price: 799,
                category_id: categoryId,
                instructor_id: instructorId,
                image_url: "https://images.unsplash.com/photo-1547658719-da2b51169166"
            }
        ];

        for (const course of courses) {
            const res = await pool.query(
                `INSERT INTO courses (title, description, price, category_id, instructor_id, image_url) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         ON CONFLICT DO NOTHING RETURNING id`,
                [course.title, course.description, course.price, course.category_id, course.instructor_id, course.image_url]
            );

            if (res.rows.length > 0) {
                const courseId = res.rows[0].id;
                // 4. Insert Lessons
                await pool.query(
                    `INSERT INTO lessons (course_id, title, content, "order") 
               VALUES ($1, $2, $3, $4)`,
                    [courseId, "Introduction", "Welcome to the course!", 1]
                );
            }
        }
        console.log("Courses and Lessons seeded.");

        console.log("Seeding complete!");
    } catch (err) {
        console.error("Error seeding database:", err.message);
    } finally {
        await pool.end();
    }
};

seed();
