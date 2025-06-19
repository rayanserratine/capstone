const express = require('express');
const router = express.Router();
const {
  getSections,
  createSection,
  updateSection,
  deleteSection
} = require('../controllers/sectionController');
const verifyToken = require('../middleware/auth');

// All routes below are protected
router.use(verifyToken);

router.get('/', getSections);
router.post('/', createSection);
router.put('/:id', updateSection);
router.delete('/:id', deleteSection);

module.exports = router;
