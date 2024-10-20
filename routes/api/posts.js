const Router = require('express');
const { getAllPosts, addPost, updatePost, deletePost, getAllPostsByUser, getPosts, getPost } = require('../../controllers/post/create-post-controller');
const router = Router();

router.get('/all-post', getAllPosts);
router.post('/add-post', addPost);
router.post('/get-posts', getPosts);
router.post('/get-post', getPost);

router.put('/update/:postId', updatePost);
router.delete('/delete/:postId', deletePost);

// router.put('/update-post/:postId', updatePost);
// router.get('/your-post/:userId', getAllPostsByUser);
// router.delete('/delete-post/:postId', deletePost);

module.exports = router;