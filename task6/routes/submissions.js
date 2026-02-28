const express = require('express');
const pool = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const sanitize = (value) => (typeof value === 'string' ? value.trim() : '');

router.get('/', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, title, content, created_at FROM submissions WHERE user_id = ? ORDER BY id DESC',
      [req.user.id]
    );

    return res.json({ items: rows });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch submissions.', details: error.message });
  }
});

router.post('/', requireAuth, async (req, res) => {
  const title = sanitize(req.body.title);
  const content = sanitize(req.body.content);

  if (!title || title.length < 3 || title.length > 120) {
    return res.status(400).json({ error: 'Title must be 3-120 characters.' });
  }

  if (!content || content.length < 5 || content.length > 1000) {
    return res.status(400).json({ error: 'Content must be 5-1000 characters.' });
  }

  try {
    const [result] = await pool.execute(
      'INSERT INTO submissions (user_id, title, content) VALUES (?, ?, ?)',
      [req.user.id, title, content]
    );

    return res.status(201).json({
      id: result.insertId,
      userId: req.user.id,
      title,
      content
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create submission.', details: error.message });
  }
});

module.exports = router;
