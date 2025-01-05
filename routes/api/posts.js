const Router = require('express');
const { getAllPosts, addPost, updatePost, deletePost, getAllPostsByUser, getPosts, getPost, getAllPostsByUserUsingId, getAllYourPosts, savedPost, unSavedPost, getSavedPosts, reactionToggle, getReactionOfPost, getPostById, getUserWhoReactToPost } = require('../../controllers/post/create-post-controller');
const { getAllCommentOfPost,
    addCommentToPost,
    updateCommentToPost,
    deleteCommentToPost,
    addReplyToComment,
    updateAddReplyToComment,
    deleteAddReplyToComment,
} = require('../../controllers/post/post-comment-controller');
const router = Router();

router.get('/my-post/:postId', getPostById)

// router.get('/:postId', getPostById)
// router.get('/users/:userId/posts', getAllPostsByUser);
router.get('/your-post/it-me/:userId', getAllPostsByUserUsingId); //?
router.put('/update/:postId', updatePost); // update post
router.delete('/delete/:postId', deletePost); // delete post
// router.get('/all-post', getAllPosts);
// router.get('/my-post', getAllYourPosts); //***// profile your posts
// router.get('/all-posts', getAllYourPosts); //***// profile your posts
router.get('/all-posts/:userId?', getAllYourPosts); //***// profile your posts
router.post('/add-post', addPost); // add or create new post
router.get('/timeline', getPosts); //***// for timeline posts
router.post('/get-post/:postId', getPost);  //?
router.post('/:postId/save', savedPost); //***// saved post
router.delete('/:postId/unsave', unSavedPost); //***// to unsaved the post
router.get('/saved', getSavedPosts); //***// get all saved posts
router.post('/:postId/reaction', reactionToggle); //react to post
router.get('/set-reacted/:postId/get-reaction', getReactionOfPost);
router.get('/:postId/reactions', getUserWhoReactToPost); // get all reaction to the post

module.exports = router;