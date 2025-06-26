const express = require('express');
const router = express.Router();
const {
  getEntries,
  createEntry,
  updateEntry,
  deleteEntry
} = require('../controllers/entryController');
const verifyToken = require('../middleware/auth');

router.use(verifyToken);

router.get('/:sectionId', getEntries); // GET /api/entries/:sectionId
router.post('/', createEntry);         // POST /api/entries
router.put('/:id', updateEntry);       // PUT /api/entries/:id
router.delete('/:id', deleteEntry);    // DELETE /api/entries/:id

module.exports = router;
