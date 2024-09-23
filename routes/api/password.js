const Router = require('express');
const router = Router();
const { updatePassword } = require('../../controllers/password-controller');
const verifyJWT = require('../../middleware/verify-jwt');

router.put('/password/:userId', updatePassword);

module.exports = router;