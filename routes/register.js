const Router = require('express');
const { signupNewUser } = require('../controllers/signup-controller');
const router = Router();

router.post('/', signupNewUser);

module.exports = router;