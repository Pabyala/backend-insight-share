const Router = require('express');
const { addPost, getAllPosts, getAllPostsByUser, updatePost, deletePost } = require('../../controllers/create-post-controller');
const router = Router();
const verifyJWT = require('../../middleware/verify-jwt');

router.put('/update-post/:postId', verifyJWT, updatePost);
router.get('/all-post', verifyJWT, getAllPosts);
router.get('/your-post/:userId', verifyJWT, getAllPostsByUser);
router.post('/add-post', verifyJWT, addPost);
router.delete('/delete-post/:postId', verifyJWT, deletePost);

module.exports = router;