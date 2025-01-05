const Router = require('express');
const { handleLogout } = require('../controllers/auth/logout-controller');
const router = Router();

router.post('/', handleLogout);

module.exports = router;