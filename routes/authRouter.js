const express = require('express');
const { signupUser, loginUser, logoutUser } = require('../controllers/authController');
const { authenticateUser } = require('../middleware/authmiddleware');
const router = express.Router();

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/protected-route', authenticateUser, (req, res) => {
    res.json({ message: "Access granted!", user: req.user });
});

module.exports = router;