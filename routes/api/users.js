const Router = require('express');
const { getAllUsers, getUserById, updateUser } = require('../../controllers/user-controller')
const router = Router();
const verifyJWT = require('../../middleware/verify-jwt');

router.put('/profile-update/:userId', verifyJWT, updateUser);
router.get('/all-users', getAllUsers);
router.get('/profile-id/:userId', getUserById);

module.exports = router;