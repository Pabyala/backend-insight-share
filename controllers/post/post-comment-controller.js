const mongoose = require('mongoose');
const Posts = require('../../model/post-model');
const Users = require('../../model/user-model');
const SavedPosts = require('../../model/save-post-modal');
const Comments = require('../../model/comment-model');

const getAllCommentOfPost = async (req, res) => {
    const { postId } = req.params;

    if(!postId) return res.status(400).json({ message: 'Fields are required.'})

    try {
        const post = await Posts.findById(postId)
        .populate({
            path: "comments",
            populate: { path: "authorId", select: "name" },
        })
        .exec();

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.status(200).json({ comments: post.comments });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const addCommentToPost = async (req, res) => {
    const { postId } = req.params;
    const { commenterId, comment } = req.body;

    if(!postId || !commenterId || !comment) return res.status(400).json({ message: 'Fields are required.'})

    try {
        const post = await Posts.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const newComment = await Comments.create({
            postId,
            comment,
            from: commenterId,
        });
        
        // res.status(201).json({ message: "Comment added successfully", newComment });

        // Add the comment _id to the post's comments array
        post.comments.push(newComment._id);
        await post.save();  // Save the post after updating the comments array

        // Populate the new comment (optional: populate user info, etc.)
        // Populate the new comment (populate user info)
        const populatedComment = await Comments.findById(newComment._id).populate('from', 'username firstName lastName avatarUrl coverPhotoUrl');

        // Respond with the success message and the populated comment
        res.status(201).json({ message: "Comment added successfully", populatedComment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// update the comment 
const updateCommentToPost = async (req, res) => {
    const { commentId } = req.params;
    const { updatedComment, userId  } = req.body

    if(!commentId || !updatedComment || !userId) return res.status(400).json({ message: 'All fields is required.'});

    try {

        const comment = await Comments.findById(commentId);
        
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.from.toString() !== userId) {
            return res.status(403).json({ message: 'You are not authorized to update this comment.' });
        }

        comment.comment = updatedComment;
        comment.updatedAt = new Date();
        
        await comment.save();

        res.json({ message: 'Comment updated successfully', comment });;

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteCommentToPost = async (req, res) => {
    const { commentId } = req.params;
    const { userId } = req.body;

    if(!commentId || !userId) return res.status(400).json({ message: 'All fields is required.'});

    try {
        const comment = await Comments.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        const post = await Posts.findById(comment.postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the user is authorized to delete the comment
        const isCommentAuthor = comment.from.toString() === userId;
        console.log("COMMENT AUTHOR", isCommentAuthor)
        const isPostAuthor = post.authorId.toString() === userId;
        console.log("POST AUTHOR", isPostAuthor)

        // if(comment.from.toString() !== userId && post.authorId.toString() !== userId){
        //     return res.status(403).json({ message: 'You are not authorized to delete this comment' });
        // }

        if (!isCommentAuthor && !isPostAuthor) {
            return res.status(403).json({ message: 'You are not authorized to delete this comment.' });
        }

        // Remove the comment ID from the post's comments array
        post.comments = post.comments.filter(
            (id) => id.toString() !== commentId
        );
        await post.save();

        // Delete the replies within the comment
        comment.replies = []; // Clear the replies array
        await comment.save(); // Save the comment after clearing replies
        await Comments.findByIdAndDelete(commentId);

        return res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const addReplyToComment = async (req, res) => {
    const { commentId } = req.params; // ID of the comment being replied to
    const { userId, reply } = req.body; // ID of the user replying and the reply content

    if (!commentId || !userId || !reply) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const comment = await Comments.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Create the reply object
        const newReply = {
            rid: new mongoose.Types.ObjectId(),
            userId,
            from: userId, // Optionally use more detailed info if necessary (like username)
            replyAt: new Date().toISOString(),
            comment: reply,
            createdAt: new Date(),
            updatedAt: new Date(),
            heart: [], // Initialize with empty heart reactions
        };

        // Add the reply to the `replies` array
        comment.replies.push(newReply);
        await comment.save();

        res.status(201).json({ message: 'Reply added successfully', reply: newReply });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateAddReplyToComment = async (req, res) => {
    const { commentId, replyId } = req.params;
    const { userId, newReplyComment } = req.body;

    if (!commentId || !replyId || !userId || !newReplyComment) return res.status(400).json({ message: 'All fields are required.' });

    try {
        const comment = await Comments.findById(commentId);
        if(!comment) return res.status(404).json({ message: 'Comment not found' });

        // find the specific reply within the comment's replies array
        const reply = comment.replies.find(reply => reply._id.toString() === replyId);
        if (!reply) {
            return res.status(403).json({ message: 'Reply not found' });
        }

        // check if the requesting user is the author of the reply
        if(reply.userId.toString() !== userId) {
            return res.status(403).json({ message: 'You are not authorized to update this reply' });
        }

        // update the reply content
        reply.comment = newReplyComment;
        reply.updatedAt = new Date(); 

        // save the updated comment
        await comment.save();

        return res.status(200).json({ message: 'Reply updated successfully', reply });
    } catch (error) {
        
    }
}

const deleteAddReplyToComment = async (req, res) => {
    const { commentId, replyId } = req.params;
    const { userId } = req.body;

    console.log(commentId)
    // Validate required fields
    if (!commentId || !replyId || !userId) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // Find the comment
        const comment = await Comments.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found...' });
        }

        // Find the reply and its index
        const replyIndex = comment.replies.findIndex(reply => reply._id.toString() === replyId);
        if (replyIndex === -1) {
            return res.status(404).json({ message: 'Reply not found.' });
        }

        const reply = comment.replies[replyIndex];

        // Check authorization
        if (
            reply.userId.toString() !== userId && 
            comment.from.toString() !== userId
        ) {
            return res.status(403).json({ message: 'You are not authorized to delete this reply.' });
        }

        // Remove the reply from the replies array
        comment.replies.splice(replyIndex, 1);

        // Save the updated comment
        await comment.save();

        return res.status(200).json({ message: 'Reply deleted successfully.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred while deleting the reply.' });
    }
};

const addOrRemoveHeartToComment = async (req, res) => {
    const { commentId } = req.params;
    const { userId } = req.body;
    // const userId = req.user.id;


    try {
        const comment = await Comments.findById(commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        // Check if user already reacted
        const heartIndex = comment.heart.indexOf(userId);
        if (heartIndex === -1) {
            // Add heart
            comment.heart.push(userId);
        } else {
            // Remove heart
            comment.heart.splice(heartIndex, 1);
        }

        await comment.save();
        res.status(200).json({ message: "Reaction updated", hearts: comment.heart });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}

const addOrRemoveHeartToReply = async (req, res) => {
    const { commentId, replyId } = req.params;
    const { userId } = req.body;
    // const userId = req.user.id;

    try {
        const comment = await Comments.findById(commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        const reply = comment.replies.id(replyId);
        if (!reply) return res.status(404).json({ message: "Reply not found" });

        // Check if user already reacted
        const heartIndex = reply.heart.indexOf(userId);
        if (heartIndex === -1) {
            // Add heart
            reply.heart.push(userId);
        } else {
            // Remove heart
            reply.heart.splice(heartIndex, 1);
        }

        await comment.save();
        res.status(200).json({ message: "Reaction updated", hearts: reply.heart });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = {
    getAllCommentOfPost,
    addCommentToPost,
    updateCommentToPost, // /update-comment/:id
    deleteCommentToPost, // /delete-comment/:id
    addReplyToComment,
    updateAddReplyToComment, // /update-reply/:commentId/:replyId
    deleteAddReplyToComment,  // /delete-reply/:commentId/:replyId
    addOrRemoveHeartToComment, // /:commentId/heart'
    addOrRemoveHeartToReply, // /:commentId/replies/:replyId/heart
}