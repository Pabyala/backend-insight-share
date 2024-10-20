const Router = require('express');
const { getAllUsers, getUserOrById, updateUser, userInfo, followUser, unfollowUser, getUserFollowData, suggestedFollowing } = require('../../controllers/user/user-controller')
const router = Router();

router.get('/all-users', getAllUsers);
router.post('/user-data/:userId?', getUserOrById); //optional either has a id or not
router.put('/profile', updateUser);
router.put('/info', userInfo);

router.post('/follow-user', followUser);
router.post('/unfollow-user', unfollowUser);
router.get('/follow-data', getUserFollowData);
router.post("/suggested-following", suggestedFollowing);

module.exports = router;