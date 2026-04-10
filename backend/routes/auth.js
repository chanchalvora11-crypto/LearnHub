const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require("../db");

// @route   POST api/auth/signup
// @desc    Register user
router.post('/signup', async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Check if user exists
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userResult.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
            [name, email, hashedPassword, role || 'student']
        );

        // Create JWT
        const payload = { id: newUser.rows[0].id, role: newUser.rows[0].role };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({ token, user: newUser.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check for user
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const user = userResult.rows[0];

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create JWT
        const payload = { id: user.id, role: user.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
