const express = require('express');
const router = express.Router();
const {
  getSections,
  getSectionsWithEntries,
  createSection,
  updateSection,
  deleteSection
} = require('../controllers/sectionController');
const verifyToken = require('../middleware/auth');

// All routes below are protected
router.use(verifyToken);

// ✅ Get sections with their entries
router.get('/with-entries', getSectionsWithEntries);

// ✅ Basic section CRUD
router.get('/', getSections);
router.post('/', createSection);
router.put('/:id', updateSection);
router.delete('/:id', deleteSection);

module.exports = router;
