const Router = require('express');
const { getNotification, markAllReadNotification, markOneNotification } = require('../../controllers/notification/user-notification');
const router = Router();

router.get("/:userId", getNotification);
router.patch("/read/:notificationId", markOneNotification);
router.put("/mark-all-read/:userId", markAllReadNotification);

module.exports = router;