const Router = require('express');
const { getAllUsers, getUserData, updateUser, userInfo, followUser, unFollowUser, getFollowers, getFollowing, suggestedFollowing, updateProfileDetails, handleChangeProfileImg, handleChangeBackgroundPhoto, getUserById, handleChangeName, handleChangeUserName } = require('../../controllers/user/user-controller')
const { uploadAvatarUrl } = require('../../controllers/user/avatar-url-controller');
const { handleImg } = require('../../controllers/user/cloudProfileImg');
const router = Router();

// user routes
router.get('/all-users', getAllUsers); // get all users
router.get('/data', getUserData); // get user data who login
// router.post('/user-data/:userId?', getUserData); //optional either has a id or not
router.get('/:userId', getUserById) // get user by id
router.put('/profile', updateUser); // update user profile (not yet implemented)
router.put('/profile/details', updateProfileDetails); // update user profile details
router.put('/info', userInfo); // ?

// user image upload routes
router.post('/update/profile-photo', handleChangeProfileImg); // update profile photo
router.post('/update/bg-photo', handleChangeBackgroundPhoto); // update bg photo

// follow and unfollow user routes
router.post('/:userIdToFollow/follow', followUser); //follow user
router.post('/:userIdToUnFollow/un-follow', unFollowUser); // unfollow user

// get followers and following routes
// router.get('/followers/:userId?', getFollowers); // get followers
router.get('/my-followers/:userId?/followers', getFollowers); // get followers
router.get('/my-following/:userId?/following', getFollowing); // get following

// suggested following routes
router.post("/suggested-following", suggestedFollowing);

router.put('/update-name', handleChangeName);
router.put('/update-username', handleChangeUserName);



module.exports = router;