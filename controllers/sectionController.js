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

// Get all sections with entries for a user
const getSectionsWithEntries = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        s.id AS section_id,
        s.name AS section_name,
        s.description AS section_description,
        e.id AS entry_id,
        e.title AS entry_title,
        e.amount AS entry_amount,
        e.date AS entry_date,
        e.note AS entry_note
      FROM sections s
      LEFT JOIN entries e ON s.id = e.section_id
      WHERE s.user_id = $1
      ORDER BY s.id, e.id
    `, [req.user.userId]);

    const grouped = {};
    for (const row of result.rows) {
      const sectionId = row.section_id;
      if (!grouped[sectionId]) {
        grouped[sectionId] = {
          id: sectionId,
          name: row.section_name,
          description: row.section_description,
          entries: [],
        };
      }
      if (row.entry_id) {
        grouped[sectionId].entries.push({
          id: row.entry_id,
          title: row.entry_title,
          amount: row.entry_amount,
          date: row.entry_date,
          note: row.entry_note,
        });
      }
    }

    res.json(Object.values(grouped));
  } catch (err) {
    console.error('Get Sections With Entries Error:', err);
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
// Delete section and its entries
const deleteSection = async (req, res) => {
  const { id } = req.params;

  try {
    // Step 1: Delete all entries for this section
    await pool.query('DELETE FROM entries WHERE section_id = $1', [id]);

    // Step 2: Delete the section
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
  getSectionsWithEntries,
  createSection,
  updateSection,
  deleteSection
};

