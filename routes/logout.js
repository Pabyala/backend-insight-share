const Router = require('express');
const { handleLogout } = require('../controllers/logout-controller');
const router = Router();

router.get('/', handleLogout);

module.exports = router;