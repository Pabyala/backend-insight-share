const Router = require('express');
const { getAllUsers, getUserData, updateUser, userInfo, followUser, unfollowUser, getFollowers, getFollowing, suggestedFollowing, updateProfileDetails, handleChangeProfileImg } = require('../../controllers/user/user-controller')
const { uploadAvatarUrl } = require('../../controllers/user/avatar-url-controller');
const { handleImg } = require('../../controllers/user/cloudProfileImg');
const router = Router();

router.get('/all-users', getAllUsers);
router.get('/data', getUserData);
// router.post('/user-data/:userId?', getUserData); //optional either has a id or not
router.put('/profile', updateUser);
router.put('/info', userInfo);

router.post('/follow-user', followUser);
router.post('/unfollow-user', unfollowUser); 
router.get('/followers', getFollowers); //get followers
router.get('/following', getFollowing); //get following
router.post("/suggested-following", suggestedFollowing);
router.put('/profile/details', updateProfileDetails);
router.post('/update/profile-photo', handleChangeProfileImg);


module.exports = router;