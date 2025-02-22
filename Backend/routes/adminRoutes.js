const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/adminlogin', userController.login);
router.post('/logout', userController.logout);

module.exports = router;
