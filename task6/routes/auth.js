const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const router = express.Router();

const sanitize = (value) => (typeof value === 'string' ? value.trim() : '');
const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

router.post('/register', async (req, res) => {
  const name = sanitize(req.body.name);
  const email = sanitize(req.body.email).toLowerCase();
  const password = sanitize(req.body.password);

  if (!name || name.length < 3 || name.length > 80) {
    return res.status(400).json({ error: 'Name must be 3-80 characters.' });
  }

  if (!isEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  }

  try {
    const [rows] = await pool.execute('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
    if (rows.length) {
      return res.status(409).json({ error: 'Email is already registered.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name, email, passwordHash]
    );

    return res.status(201).json({
      message: 'User registered successfully.',
      user: { id: result.insertId, name, email }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Registration failed.', details: error.message });
  }
});

router.post('/login', async (req, res) => {
  const email = sanitize(req.body.email).toLowerCase();
  const password = sanitize(req.body.password);

  if (!isEmail(email) || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const [rows] = await pool.execute(
      'SELECT id, email, password_hash FROM users WHERE email = ? LIMIT 1',
      [email]
    );

    const user = rows[0];
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    return res.json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    return res.status(500).json({ error: 'Login failed.', details: error.message });
  }
});

module.exports = router;
