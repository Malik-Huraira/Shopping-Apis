const express = require('express');
const router = express.Router();
const { sendNotification } = require('../controllers/emailController');

router.post('/send-notification', sendNotification);

module.exports = router;