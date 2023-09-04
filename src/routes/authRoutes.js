const express = require('express');
const {
    signUp,
    signIn,
    signInUsingToken,
    forgotPassword,
    resetPassword,
    verifyEmail,
} = require('../controllers/authController');

const router = express.Router();

router.post('/sign-up', signUp);
router.post('/sign-in', signIn);
router.post('/sign-in-using-token', signInUsingToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/verify-email', verifyEmail);

module.exports = router;
