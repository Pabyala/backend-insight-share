const Router = require('express');
const { signinUser } = require('../controllers/auth/auth-controller');
const router = Router();

router.post('/', signinUser);

module.exports = router;