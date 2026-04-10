const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const run = async () => {
    try {
        console.log("Initializing database schema...");
        const schema = fs.readFileSync(path.join(__dirname, "full_schema.sql"), "utf8");
        await pool.query(schema);
        console.log("Schema initialized.");

        console.log("Seeding sample data...");

        // Check if we have any users
        const users = await pool.query("SELECT id FROM users LIMIT 1");
        if (users.rows.length === 0) {
            console.log("No users found. Please sign up in the app first to define an instructor/student.");
            // We could create a mock user here, but it's better if the user signs up.
            // However, to make it "work" immediately, let's create one.
            const bcrypt = require("bcryptjs");
            const hashed = await bcrypt.hash("password123", 10);
            await pool.query(
                "INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3,$4) ON CONFLICT DO NOTHING",
                ["Demo Instructor", "instructor@example.com", hashed, "instructor"]
            );
            await pool.query(
                "INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3,$4) ON CONFLICT DO NOTHING",
                ["Demo Student", "student@example.com", hashed, "student"]
            );
            console.log("Demo users created.");
        }

        const instructor = await pool.query("SELECT id FROM users WHERE role='instructor' LIMIT 1");
        const student = await pool.query("SELECT id FROM users WHERE role='student' LIMIT 1");

        const instId = instructor.rows[0]?.id || (await pool.query("SELECT id FROM users LIMIT 1")).rows[0]?.id;
        const stuId = student.rows[0]?.id || instId;

        // Categories
        const categories = ["Web Development", "UI/UX Design", "Data Science", "Mobile Apps"];
        for (const cat of categories) {
            await pool.query("INSERT INTO categories (name) VALUES ($1) ON CONFLICT DO NOTHING", [cat]);
        }
        const catResult = await pool.query("SELECT id FROM categories");
        const categoryIds = catResult.rows.map(r => r.id);

        // Courses
        const courses = [
            { title: "React for Beginners", price: 499, desc: "Start your journey with React and Hooks.", catIdx: 0 },
            { title: "Advanced Node.js", price: 899, desc: "Deep dive into Node.js internals and scaling.", catIdx: 0 },
            { title: "UI Design Patterns", price: 299, desc: "Master the art of UI design and spacing.", catIdx: 1 },
            { title: "Python for Data Science", price: 599, desc: "Learn NumPy, Pandas, and Matplotlib.", catIdx: 2 },
            { title: "Flutter Mastery 2024", price: 799, desc: "Build beautiful cross-platform apps.", catIdx: 3 },
            { title: "UX Psychology", price: 199, desc: "Understand how users think and behave.", catIdx: 1 }
        ];

        const createdCourseIds = [];
        for (const c of courses) {
            const catId = categoryIds[c.catIdx % categoryIds.length];
            let res = await pool.query("SELECT id FROM courses WHERE title = $1", [c.title]);
            let courseId;
            if (res.rows.length === 0) {
                res = await pool.query(
                    "INSERT INTO courses (title, description, price, category_id, instructor_id) VALUES ($1, $2, $3, $4, $5) RETURNING id",
                    [c.title, c.desc, c.price, catId, instId]
                );
                courseId = res.rows[0].id;
            } else {
                courseId = res.rows[0].id;
            }
            createdCourseIds.push({ id: courseId, price: c.price });

            // Multiple lessons per course
            const lessonTitles = ["Introduction", "Core Concepts", "Hands-on Project", "Advanced Techniques"];
            for (let i = 0; i < lessonTitles.length; i++) {
                await pool.query(
                    "INSERT INTO lessons (course_id, title, content, order_number) VALUES ($1,$2,$3,$4) ON CONFLICT DO NOTHING",
                    [courseId, lessonTitles[i], `This is the content for ${lessonTitles[i]}`, i + 1]
                );
            }
        }

        // Auto-enroll ALL users in ALL 6 courses
        const allUsers = await pool.query("SELECT id FROM users");
        console.log(`Deep Seeding: Auto-enrolling ${allUsers.rows.length} users in all 6 courses...`);

        for (const u of allUsers.rows) {
            for (const c of createdCourseIds) {
                // Enrollment
                await pool.query(
                    "INSERT INTO enrollments (user_id, course_id) VALUES ($1,$2) ON CONFLICT DO NOTHING",
                    [u.id, c.id]
                );

                // Payment
                await pool.query(
                    "INSERT INTO payments (user_id, course_id, amount, status, method, transaction_ref, paid_at) VALUES ($1,$2,$3,$4,$5,$6,CURRENT_TIMESTAMP) ON CONFLICT DO NOTHING",
                    [u.id, c.id, c.price, 'success', 'mock', `DEEP_SEED_${u.id}_${c.id}`]
                );

                // Progress: Mark first 2 lessons as completed for every course
                const lessons = await pool.query("SELECT id FROM lessons WHERE course_id = $1 ORDER BY order_number LIMIT 2", [c.id]);
                for (const lesson of lessons.rows) {
                    await pool.query(
                        "INSERT INTO progress (user_id, lesson_id, is_completed) VALUES ($1,$2,true) ON CONFLICT DO NOTHING",
                        [u.id, lesson.id]
                    );
                }
            }
        }

        // Add Study Materials (PDFs) for each course
        console.log("Adding specific study materials...");
        const materialMap = {
            "React for Beginners": [
                { title: "React Cheat Sheet 2024", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
                { title: "Hooks Reference Guide", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
                { title: "Redux vs Context API", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" }
            ],
            "Advanced Node.js": [
                { title: "Node.js Event Loop Deep Dive", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
                { title: "Worker Threads Guide", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
                { title: "Security Best Practices", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" }
            ],
            "UI Design Patterns": [
                { title: "Design Systems 101", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
                { title: "Typography Scale PDF", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
                { title: "Color Psychology", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" }
            ],
            "Python for Data Science": [
                { title: "Pandas Cheat Sheet", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
                { title: "Matplotlib Gallery", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
                { title: "NumPy Fundamentals", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" }
            ],
            "Flutter Mastery 2024": [
                { title: "State Management in Flutter", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
                { title: "Widget Lifecycle", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
                { title: "Dart Language Guide", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" }
            ],
            "UX Psychology": [
                { title: "Nielsen's Heuristics", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
                { title: "Fitts's Law Guide", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
                { title: "User Research PDF", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" }
            ]
        };

        for (const c of createdCourseIds) {
            // Get title for matching
            const cRes = await pool.query("SELECT title FROM courses WHERE id=$1", [c.id]);
            const title = cRes.rows[0].title;
            const materials = materialMap[title] || [
                { title: "Course Overview PDF", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
                { title: "Learning Resource Guide", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" }
            ];

            for (const m of materials) {
                await pool.query(
                    "INSERT INTO course_materials (course_id, title, file_url) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING",
                    [c.id, m.title, m.url]
                );
            }
        }

        console.log("Seeding complete!");
    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        await pool.end();
    }
};

run();
