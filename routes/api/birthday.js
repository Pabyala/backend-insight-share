const Router = require('express');
const { getBirthdayToday } = require('../../controllers/birthday/birthday-controller');
const router = Router();

router.get('/today-birthday', getBirthdayToday);

module.exports = router;