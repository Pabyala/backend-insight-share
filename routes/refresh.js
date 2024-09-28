const Router = require('express');
const { handleRefreshToken } = require('../controllers/refresh-token-controller');
const router = Router();

router.get('/', handleRefreshToken);

module.exports = router;