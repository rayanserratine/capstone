const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('Many Money API is running');
});

// Database connection
const pool = require('./config/db');

// DB test route
app.get('/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows[0]);
  } catch (err) {
    console.error('DB ERROR:', err);
    res.status(500).send('Database error');
  }
});

// ✅ Load auth routes
app.use('/api/auth', require('./routes/authRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use('/api/sections', require('./routes/sectionRoutes'));

app.use('/api/entries', require('./routes/entryRoutes'));
