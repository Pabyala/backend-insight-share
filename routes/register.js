const Router = require('express');
const { signupNewUser, verifyEmail, resetPassword, setNewPassword, resendVerificationCode, verifyResetPasswordCode } = require('../controllers/auth/signup-controller');
const router = Router();

router.post('/', signupNewUser);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification-code', resendVerificationCode);
router.post('/set-new-password-success', setNewPassword);
router.post('/reset-password', resetPassword);
router.post('/verify-token-reset-password', verifyResetPasswordCode);

module.exports = router; 