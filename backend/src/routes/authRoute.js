const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { 
    userRegister, 
    userLogin, 
    userProfile, 
    userLogout, 
    updateProfile, 
    changePassword, 
    addCredits, 
    forgotPassword 
} = require('../controller/authController');

router.post('/register', userRegister);
router.post('/login', userLogin);
router.post('/forgot-password', forgotPassword);
router.get('/profile', verifyToken, userProfile);
router.post('/logout', userLogout);
router.put('/update-profile', verifyToken, updateProfile);
router.put('/change-password', verifyToken, changePassword);
router.post('/add-credits', verifyToken, addCredits);

module.exports = router;
