const pool = require('../config/db');

// Get all sections for a user
const getSections = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM sections WHERE user_id = $1',
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Get Sections Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new section
const createSection = async (req, res) => {
  const { name, description } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO sections (user_id, name, description) VALUES ($1, $2, $3) RETURNING *',
      [req.user.userId, name, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create Section Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update section
const updateSection = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const result = await pool.query(
      'UPDATE sections SET name = $1, description = $2 WHERE id = $3 AND user_id = $4 RETURNING *',
      [name, description, id, req.user.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Section not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update Section Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete section
const deleteSection = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM sections WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.user.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Section not found' });
    }
    res.json({ message: 'Section deleted' });
  } catch (err) {
    console.error('Delete Section Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getSections,
  createSection,
  updateSection,
  deleteSection
};
