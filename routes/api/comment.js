const Router = require('express');
const { getAllCommentOfPost,
    addCommentToPost,
    updateCommentToPost,
    deleteCommentToPost,
    addReplyToComment,
    updateAddReplyToComment,
    deleteAddReplyToComment,
    addOrRemoveHeartToComment, // /:commentId/heart'
    addOrRemoveHeartToReply // /:commentId/replies/:replyId/heart
} = require('../../controllers/post/post-comment-controller');
const router = Router();

// router.post('/today-birthday', addCommentToPost);
// router.delete()

// comment
// router.post('/:postId/comment', addCommentToPost) // comment to the post
router.post('/:postId', addCommentToPost) // comment to the post
router.put('/update-comment/:commentId', updateCommentToPost) // update the comment
router.delete('/delete-comment/:commentId', deleteCommentToPost) // delete comment
router.post('/:commentId/heart', addOrRemoveHeartToComment) 

// replies
router.post('/:commentId/replies/:replyId/heart', addOrRemoveHeartToReply)
router.post('/:commentId/reply', addReplyToComment)
router.put('/update-reply/:commentId/:replyId', updateAddReplyToComment)
router.delete('/delete-reply/:commentId/:replyId', deleteAddReplyToComment)

module.exports = router;