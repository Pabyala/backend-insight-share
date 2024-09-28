const Router = require('express');
const { addPost, getAllPosts, getAllPostsByUser, updatePost, deletePost } = require('../../controllers/create-post-controller');
const router = Router();
const verifyJWT = require('../../middleware/verify-jwt');

router.put('/update-post/:postId', updatePost);
router.get('/all-post', getAllPosts);
router.get('/your-post/:userId', getAllPostsByUser);
router.post('/add-post', addPost);
router.delete('/delete-post/:postId', deletePost);

module.exports = router;