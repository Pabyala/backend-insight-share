const Router = require('express');
const { signupNewUser } = require('../controllers/auth/signup-controller');
const router = Router();

router.post('/', signupNewUser);

module.exports = router;