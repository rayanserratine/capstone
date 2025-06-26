const pool = require('../config/db');

const getEntries = async (req, res) => {
  const { sectionId } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM entries WHERE section_id = $1',
      [sectionId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Get Entries Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const createEntry = async (req, res) => {
  const { section_id, title, amount, date, note } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO entries (section_id, title, amount, date, note)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [section_id, title, amount, date, note]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create Entry Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateEntry = async (req, res) => {
  const { id } = req.params;
  const { title, amount, date, note } = req.body;
  try {
    const result = await pool.query(
      `UPDATE entries
       SET title = $1, amount = $2, date = $3, note = $4
       WHERE id = $5 RETURNING *`,
      [title, amount, date, note, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update Entry Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteEntry = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM entries WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    res.json({ message: 'Entry deleted' });
  } catch (err) {
    console.error('Delete Entry Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getEntries,
  createEntry,
  updateEntry,
  deleteEntry
};
