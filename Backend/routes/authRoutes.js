const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController')

router.get('/google/callback',authController.getCallback);
router.get('/google',authController.getlogin);

module.exports = router;