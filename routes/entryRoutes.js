const express = require('express');
const router = express.Router();
const {
  getEntriesBySection,
  addEntry,
  updateEntry,
  deleteEntry
} = require('../controllers/entryController');
const verifyToken = require('../middleware/auth');

router.use(verifyToken);

router.get('/section/:sectionId', getEntriesBySection);
router.post('/section/:sectionId', addEntry);
router.put('/:id', updateEntry);
router.delete('/:id', deleteEntry);

module.exports = router;
