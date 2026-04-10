const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const { pool } = require('./db');


pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    console.log('Connected to PostgreSQL database');
    release();
});

// Basic Route
app.get('/', (req, res) => {
    res.send('LearnHub API is running...');
});

// Import Routes
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const enrollmentRoutes = require('./routes/enrollments');
const progressRoutes = require("./routes/progress");
const paymentRoutes = require("./routes/payments");
const profileRoutes = require("./routes/profile");
const statsRoutes = require("./routes/stats");

app.use("/api/progress", progressRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/stats", statsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = { pool };
