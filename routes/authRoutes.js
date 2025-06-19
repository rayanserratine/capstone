const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const verifyToken = require('../middleware/auth');

// ✅ Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// ✅ Test route to confirm routing works
router.get('/test', (req, res) => {
  res.send('Auth route is working');
});

// ✅ Protected route using JWT
router.get('/protected', verifyToken, (req, res) => {
  res.json({ message: `Hello user ${req.user.userId}` });
});

console.log('✅ Auth routes loaded');
module.exports = router;
