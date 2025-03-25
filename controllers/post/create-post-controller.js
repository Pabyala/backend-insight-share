const Posts = require('../../model/post-model');
const Users = require('../../model/user-model');
const SavedPosts = require('../../model/save-post-modal');
const Comments = require('../../model/comment-model');
const Notification = require('../../model/notification-model');
// const main = require('../../index')
const main = require('../../index');
const { io } = require('../../socket-io/socket-setup');
// const io = req.app.get('socketio');

// get all posts of all users
const getAllPosts = async (req, res) => {
    try {
        const posts = await Posts.find().populate('authorName', 'username firstName middleName lastName');  // Populate 'userId' with 'username' from User model
        if (!posts || posts.length === 0) {
            return res.status(204).json({ message: 'No posts found.' });
        }
        res.json({ allPost: posts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getPostById = async (req, res) => {
    const { postId } = req.params;

    if(!postId) return res.status(400).json({ message: 'Post ID is required.' });

    try {
        const post = await Posts.findById(postId)
        .populate({
            path: "authorId",
            select: "username firstName middleName lastName avatarUrl coverPhotoUrl"
        })
        .populate({
            path: "reactions.like reactions.fire reactions.handsUp reactions.disLike reactions.heart",
            select: "username firstName middleName lastName avatarUrl coverPhotoUrl",
        })
        .sort({ _id: -1 });
        
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const comments = await Comments.find({ postId: postId })
            .populate('from', 'username firstName lastName avatarUrl coverPhotoUrl') 
            .populate('from', 'username firstName lastName avatarUrl coverPhotoUrl')
            .populate('replies.userId', 'username firstName lastName avatarUrl')
            .populate('heart', 'username firstName middleName lastName avatarUrl coverPhotoUrl'); 

        post.comments = comments;

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// add post
const addPost = async (req, res) => {
    const userIdFormAuth = req.user.id;
    const { captionPost } = req.body

    if(!captionPost) return res.status(400).json({ message: 'Fields are required.'})
    
    try {
        const post = {
            authorId: userIdFormAuth,
            captionPost
        }

        const newPost = await Posts.create(post)

        res.json({ message: 'Post successfully', newPost });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// update post
const updatePost = async (req, res) => {
    const { postId } = req.params;
    const { captionPost } = req.body
    const userId = req.user.id;

    try {

        if(!captionPost) return res.status(400).json({ message: 'Post content is required.'});

        const post = await Posts.findById(postId);
        console.log(post)
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (!post.authorId.equals(userId)) {
            return res.status(403).json({ message: 'You are not authorized to update this post' });
        }

        const updatedPost = await Posts.findByIdAndUpdate(
            postId,
            { captionPost },
            { new: true } 
        );

        res.json({ message: 'Post updated successfully', updatedPost });;

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// delete post
const deletePost = async (req, res) => {
    const { postId } = req.params;
    
    try {
        const post = await Posts.findByIdAndDelete(postId).exec();

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        io.emit('deletedPost', postId);

        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// timeline posts
const getPosts = async (req, res) => {
    const userIdFormAuth = req.user.id;
    const { search } = req.body;

    try {
        const user = await Users.findById(userIdFormAuth);
        const following = user?.following?.map(f => f.toString()) ?? [];
        following.push(userIdFormAuth); // Include the user’s own posts

        const searchPostQuery = search
            ? { captionPost: { $regex: search, $options: "i" } }
            : {};

        // Fetch posts and populate author details
        const posts = await Posts.find(searchPostQuery)
            .populate({
                path: "authorId",
                select: "username firstName middleName lastName avatarUrl",
            })
            .populate({
                path: "reactions.like reactions.fire reactions.handsUp reactions.disLike reactions.heart",
                select: "username firstName middleName lastName avatarUrl coverPhotoUrl",
            })
            .populate({
                path: "comments",  // populate the comments field
                select: "comment from replies heart",  // select the fields you want from comments
                populate: { 
                    path: "from",  // populate the user who made the comment
                    select: "username firstName middleName lastName avatarUrl coverPhotoUrl"
                }
            })
            .sort({ _id: -1 });

        const followingPosts = posts.filter(post =>
            following.includes(post?.authorId?._id.toString())
        );

        const otherPosts = posts.filter(
            post => !following.includes(post?.authorId?._id.toString())
        );

        const postsRes = followingPosts.length > 0
            ? search ? followingPosts : [...followingPosts, ...otherPosts]
            : posts;

        // Emit the updated posts to all connected clients
        // const io = req.app.get('socketio');
        // io.emit('postsUpdated', postsRes);  // This will notify clients of any updated posts
        
        res.status(200).json({
            message: "Posts fetched successfully",
            postCount: postsRes.length,
            dataPost: postsRes,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getPost = async (req, res) => {
    const { postId } = req.params;
    try {
        const post = await Posts.findById(postId).populate({
            path: "authorId",
            select: "username firstName middleName lastName avatarUrl coverPhotoUrl"
        })

        res.status(200).json({ message: "Successfully", dataPost:  post })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// get all posts of the specific user
const getAllYourPosts = async (req, res) => {
    // const userId = req.user.id;
    const userId = req.params.userId || req.user?.id; 

    if(!userId) return res.status(400).json({ message: 'User id are required.'}) 

    try {
        const posts = await Posts.find({ authorId: userId })
            .populate({
                path: "authorId",
                select: "username firstName middleName lastName avatarUrl coverPhotoUrl",
            })
            .populate({
                path: "reactions.like reactions.fire reactions.handsUp reactions.disLike reactions.heart",
                select: "username firstName middleName lastName avatarUrl coverPhotoUrl",
            })
            .populate({
                path: "comments",  // populate the comments field
                select: "comment from replies heart",  // select the fields you want from comments
                populate: { 
                    path: "from",  // populate the user who made the comment
                    select: "username firstName middleName lastName avatarUrl coverPhotoUrl"
                }
            })
        if (!posts || posts.length === 0) {
            // return res.status(204).json({ message: 'No posts found for this user.' });
            return res.status(200).json({ 
                message: 'No posts found for this user.',
                postCount: 0,
                dataPost: [],
            });
        }
        // res.json({ yourAllPost: posts });
        res.status(200).json({
            message: "Posts fetched successfully",
            postCount: posts.length,
            dataPost: posts,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getAllPostsByUserUsingId = async (req, res) => {
    const userId = req.params;
    try {
        const posts = await Posts.find({ 'authorId': userId })
        .populate({
            path: "authorId",
            select: "username firstName middleName lastName avatarUrl"
        });
        if (!posts || posts.length === 0) {
            return res.status(204).json({ message: 'No posts found for this user.' });
        }
        res.json({ yourAllPost: posts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const savedPost = async (req, res) => {
    const userIdFromAuth = req.user.id;
    const { postId } = req.params

    if(!postId) return res.status(400).json({ message: 'Post id are required.'})
    
    try {
        // check if the post is already saved
        const existingSavedPost = await SavedPosts.findOne({
            postId: postId,
            userSaved: userIdFromAuth
        });

        if (existingSavedPost) {
            return res.status(409).json({ message: 'Post already saved.' });
        }

        const savedPost = await SavedPosts.create({
            postId,
            userSaved: userIdFromAuth
        })

        const mySavedPost = await SavedPosts.findById(savedPost._id)
            .populate({
                path: "postId",
                populate: {
                    path: "reactions.like reactions.fire reactions.handsUp reactions.disLike reactions.heart",
                    select: "username firstName middleName lastName avatarUrl coverPhotoUrl",
                }
            });

        res.json({ message: 'Post successfully saved', mySavedPost });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const unSavedPost = async (req, res) => {
    const userIdFromAuth = req.user.id;
    const { postId } = req.params

    if(!postId) return res.status(400).json({ message: 'Post id are required.'})
    
    try {

        const savedPost = await SavedPosts.findOneAndDelete({
            postId: postId,
            userSaved: userIdFromAuth
        }).exec();

        if (!savedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json({ message: 'Post unsaved successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getSavedPosts = async (req, res) => {
    const userIdFromAuth = req.user.id;
    try {
        const savedPosts = await SavedPosts.find({ userSaved: userIdFromAuth })
            .populate({
                path: 'postId',
                populate: [
                {
                    path: 'authorId', 
                    select: 'username firstName lastName avatarUrl' 
                },
                {
                path: "reactions.like reactions.fire reactions.handsUp reactions.disLike reactions.heart",
                select: "username firstName middleName lastName avatarUrl coverPhotoUrl",
            }
            ]
        });

        if (!savedPosts || savedPosts.length === 0) {
            // return res.status(204).json({ message: 'No saved posts found.' });
            return res.status(200).json({ 
                message: 'No saved posts found.',
                savedPostCount: 0,
                savedPosts: [],
            });
        }

        // filter out entries with null or invalid postId
        const validSavedPosts = savedPosts.filter(savedPost => savedPost.postId);

        // formattedPost structure
        const formattedPosts = validSavedPosts.map(savedPost => {
            const post = savedPost.postId; // access the populated postId
            return {
                _id: post._id,
                authorId: post.authorId, // this will contain the populated author info
                captionPost: post.captionPost,
                comments: post.comments || [], // default to empty array if no comments
                reactions: post.reactions,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
                __v: post.__v
            };
        });

        res.status(200).json({
            message: "Saved posts fetched successfully",
            savedPostCount: formattedPosts.length,
            savedPosts: formattedPosts,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const reactionToggle = async (req, res) => {
    const { postId } = req.params;
    const { userId, reactionType } = req.body;

    if (!userId || !postId || !reactionType) {  
        return res.status(400).json({ message: "User ID, post ID, and reaction type are required." });
    }

    try {
        // Find the post
        const post = await Posts.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        // Ensure reaction type exists in schema
        if (!post.reactions[reactionType]) {
            return res.status(400).json({ message: "Invalid reaction type" });
        }

        let previousReactionType = null;

        // Find the previous reaction of the user
        Object.keys(post.reactions).forEach((type) => {
            if (post.reactions[type].includes(userId)) {
                previousReactionType = type;
                post.reactions[type] = post.reactions[type].filter((id) => id.toString() !== userId);
            }
        });

        // Add the new reaction only if it's different from the previous one
        if (previousReactionType !== reactionType) {
            post.reactions[reactionType].push(userId);
        }

        await post.save();

        // Get Socket.io instance
        // const io = req.app.get("socketio");

        if (userId !== post.authorId.toString()) {
            let notification = await Notification.findOne({
                senderId: userId,
                receiverId: post.authorId,
                postId: postId,
                type: "reaction",
            });

            if (notification) {
                if (previousReactionType !== reactionType) {
                    // Update existing notification with new reaction type
                    notification.typeOfNotification = reactionType;
                    notification.message = `reacted to your post.`;
                    notification.createdAt = new Date(); // Update timestamp
                    await notification.save();
                }
            } else {
                // Create a new notification if it doesn't exist
                notification = new Notification({
                    senderId: userId,
                    receiverId: post.authorId,
                    type: "reaction",
                    postId: postId,
                    message: `reacted to your post.`,
                    typeOfNotification: reactionType,
                    commentId: null,
                    userId: userId,
                });

                await notification.save();
            }

            io.emit('addReactPost', reactionType);
        }

        res.status(200).json({ message: "Reaction updated", reactions: post.reactions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred", error });
    }
};


const getReactionOfPost = async (req, res) => {
    const { postId } = req.params;
    
    try {
        // Find the post by its ID and select only the reactions field
    const post = await Posts.findById(postId).select('reactions').populate({
        path: 'reactions.like reactions.fire reactions.handsUp reactions.disLike reactions.heart',
        select: 'username' // assuming Users schema has a username field
    });

    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }

    const reactions = {
        like: { count: post.reactions.like.length, users: post.reactions.like },
        fire: { count: post.reactions.fire.length, users: post.reactions.fire },
        handsUp: { count: post.reactions.handsUp.length, users: post.reactions.handsUp },
        disLike: { count: post.reactions.disLike.length, users: post.reactions.disLike },
        heart: { count: post.reactions.heart.length, users: post.reactions.heart }
    };
    res.json(reactions);
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error });
    }
}

const getUserWhoReactToPost = async (req, res) => {
    const { postId } = req.params;

    if (!postId) return res.status(400).json({ message: 'All fields are required.' });

    try {
        const post = await Posts.findById(postId).populate([
            { path: 'reactions.like', select: 'username firstName middleName lastName avatarUrl coverPhotoUrl' },
            { path: 'reactions.fire', select: 'username firstName middleName lastName avatarUrl coverPhotoUrl' },
            { path: 'reactions.handsUp', select: 'username firstName middleName lastName avatarUrl coverPhotoUrl' },
            { path: 'reactions.disLike', select: 'username firstName middleName lastName avatarUrl coverPhotoUrl' },
            { path: 'reactions.heart', select: 'username firstName middleName lastName avatarUrl coverPhotoUrl' },
        ]);

        if (!post) return res.status(404).json({ message: "Comment not found" });

        // Combine all reactions into a single "all" array
        const allUsers = [
            // ...post.reactions.like,
            // ...post.reactions.fire,
            // ...post.reactions.handsUp,
            // ...post.reactions.disLike,
            // ...post.reactions.heart,
            ...post.reactions.like.map(user => ({ ...user.toObject(), reactionType: 'like' })),
            ...post.reactions.fire.map(user => ({ ...user.toObject(), reactionType: 'fire' })),
            ...post.reactions.handsUp.map(user => ({ ...user.toObject(), reactionType: 'handsUp' })),
            ...post.reactions.disLike.map(user => ({ ...user.toObject(), reactionType: 'disLike' })),
            ...post.reactions.heart.map(user => ({ ...user.toObject(), reactionType: 'heart' })),
        ];

        return res.status(200).json({
            message: 'Users for all reactions',
            reactions: {
                all: allUsers,
                like: post.reactions.like,
                fire: post.reactions.fire,
                handsUp: post.reactions.handsUp,
                disLike: post.reactions.disLike,
                heart: post.reactions.heart,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}

module.exports = { 
    getAllPosts, 
    getPostById,
    addPost, 
    updatePost, 
    deletePost, 
    getPosts, 
    getPost, 
    getAllPostsByUserUsingId, 
    getAllYourPosts,
    savedPost,
    unSavedPost,
    getSavedPosts,
    reactionToggle,
    getReactionOfPost,
    getUserWhoReactToPost,
};