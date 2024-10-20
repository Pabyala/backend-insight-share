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

const getPosts = async (req, res) => {
    // const userIdFormAuth = req.user.id;
    // const { search } = req.body;
    // try {
    //     const user = await Users.findById(userIdFormAuth);
    //     // const following = user?.following?.toString().split(",") ?? [];
    //     const following = user?.following ?? [];
    //     following.push(userIdFormAuth);

    //     // const searchPostQuery = {
    //     //     $or: [{
    //     //             captionPost: { $regex: search, $options: "i"}
    //     //     }]
    //     // };

    //     const searchPostQuery = search
    //         ? { captionPost: { $regex: search, $options: "i" } }
    //         : {};

    //     const posts = await Posts.find(search ? searchPostQuery : {})
    //     .populate({
    //         path: "authorId",
    //         select: "username firstName middleName lastName avatarUrl coverPhotoUrl"
    //     })
    //     .sort({ _id: -1 });

    //     const followingPosts = posts?.filter((post) => {
    //         return following.includes(post?.authorId?._id.toString());
    //     });

    //     const otherPosts = posts?.filter(
    //         (post) => !following.includes(post?.authorId?._id.toString())
    //     )

    //     let postsRes = null;

    //     if(followingPosts?.length > 0){
    //         postsRes = search ? followingPosts : [...followingPosts, otherPosts];
    //     } else {
    //         postsRes = posts;
    //     }

    //     res.status(200).json({ message: "Successfully", dataPost:  postsRes })
    // } catch (error) {
    //     res.status(500).json({ message: error.message });
    // }

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
                select: "username firstName middleName lastName avatarUrl coverPhotoUrl",
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

        res.status(200).json({
            message: "Posts fetched successfully",
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

module.exports = { getAllPosts, addPost, updatePost, deletePost, getAllPostsByUser, getPosts, getPost };