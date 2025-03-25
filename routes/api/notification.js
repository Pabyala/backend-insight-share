const Router = require('express');
const getNotifications = require('../../controllers/notification/get-all-nitification');
const router = Router();

router.get("/:userId", getNotifications);

module.exports = router;    