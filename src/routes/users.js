const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const {userProfile,updateUser} = require ('../controllers/userController');

router.get('/me', protect, userProfile);
router.put('/me', protect, updateUser);

module.exports = router;