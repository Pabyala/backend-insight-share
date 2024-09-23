const Post = require('../model/post-model');
const User = require('../model/user-model');

// get all posts of all users
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('authorName', 'username firstName middleName lastName');  // Populate 'userId' with 'username' from User model
        if (!posts || posts.length === 0) {
            return res.status(204).json({ message: 'No posts found.' });
        }
        res.json({ allPost: posts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// get all posts of the specific user
const getAllPostsByUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const posts = await Post.find({ 'authorId': userId }).populate('authorName', 'username firstName middleName lastName');  // Populate 'userId' with 'username' from User model
        if (!posts || posts.length === 0) {
            return res.status(204).json({ message: 'No posts found for this user.' });
        }
        res.json({ yourPost: posts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// add Post
const addPost = async (req, res) => {
    const { userId, content } = req.body;

    if(!userId || !content ) return res.status(400).json({ message: 'All fields are required.'})
    
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const newPost = await Post.create({
                authorName: user._id,
                authorId: user._id,
                content
        })
        console.log("Created post :.", newPost);

        res.status(201).json({ message: 'Posted', post: newPost});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// update post
const updatePost = async (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;
    
    if(!postId) return res.status(400).json({ message: 'Id parameter is required.'});
    if(!content) return res.status(400).json({ message: 'Post content is required.'});
    
    try {
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        if (post.authorId.toString() !== userId) {
            return res.status(403).json({ message: 'You are not authorized to update this post.' });
        }

        post.content = content;
        const updatedPost = await post.save();
        
        res.json({ message: 'Post updated successfully', post: updatedPost });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// delete post
const deletePost = async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;

    if(!postId) return res.status(400).json({ message: 'Id parameter is required.'});
    
    try {
        const post = await Post.findById(postId).exec();;

        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        if (post.authorId.toString() !== userId) {
            return res.status(403).json({ message: 'You are not authorized to delete this post.' });
        }

        await post.deleteOne();

        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getAllPosts, getAllPostsByUser, addPost, updatePost, deletePost };