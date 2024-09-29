const Posts = require('../../model/post-model');
const Users = require('../../model/user-model');

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

    try {
        if(!captionPost) return res.status(400).json({ message: 'Post content is required.'});

        const updatePostContent = { captionPost } 
        const updatedPost = await Posts.findByIdAndUpdate(postId, updatePostContent, {
            new: true,
        })

        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json({ message: 'Updated successfully', updatedPost });

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

        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


// get all posts of the specific user
const getAllPostsByUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const posts = await Posts.find({ 'authorId': userId }).populate('authorName', 'username firstName middleName lastName');  // Populate 'userId' with 'username' from User model
        if (!posts || posts.length === 0) {
            return res.status(204).json({ message: 'No posts found for this user.' });
        }
        res.json({ yourPost: posts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getAllPosts, addPost, updatePost, deletePost, getAllPostsByUser };