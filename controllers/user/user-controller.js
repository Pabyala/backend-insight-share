const Users = require('../../model/user-model');

// git all the user
const getAllUsers = async (req, res) => {
    try {
        const users = await Users.find();
        if (!users) {
            return res.status(404).json({ message: 'No users found' })
        }
        res.json({ allUsers: users })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// git user by id
const getUserOrById = async (req, res) => {

    const userIdFormAuth = req.user.id;
    const { userId } = req.params

    try {
        const user = await Users.findById(userId ?? userIdFormAuth)
        if (!user) {
            return res.status(404).json({ message: 'No user found..' })
        }
        res.json({ userInfo: user })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// update the user profile
const updateUser = async (req, res) => {
    const  userIdFormAuth = req.user.id;
    const { username, firstName, middleName, lastName, email, gender, phoneNumber, dateOfBirth } = req.body;

    try {
        if (!userIdFormAuth) return res.status(400).json({ message: 'You are not authorized to update this user.' });

        if (!username || !firstName || !middleName || !lastName || !email || !gender || !phoneNumber || !dateOfBirth) return res.status(400).json({ message: 'Please provide all required fields.'})

        // check if the new email and phone number is already exist, excluding the current user.
        const emailDuplicate = await Users.findOne({ email, _id: { $ne: userIdFormAuth } }).exec();
        const phoneNumDuplicate = await Users.findOne({ phoneNumber, _id: { $ne: userIdFormAuth }}).exec();

        if (emailDuplicate) return res.status(400).json({ message: 'Email already exist.' });
        if (phoneNumDuplicate) return res.status(400).json({ message: 'Phone number already exist.' });

        const updateUserData = {
            username, firstName, middleName, lastName, email, gender, phoneNumber, dateOfBirth
        } 
        
        const updatedUser = await Users.findByIdAndUpdate(userIdFormAuth, updateUserData, {
            new: true,
        })

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Updated successfully', userInfo: updatedUser });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// update the user info
const userInfo = async (req, res) => {
    const userIdFormAuth = req.user.id;
    const { livesIn, studyAt, bio, userStatus, workAt } = req.body;

    try {
        if (!userIdFormAuth) {
            return res.status(400).json({ message: 'You are not authorized to update this user.' });
        }
    
        const user = await Users.findById(userIdFormAuth);
    
        if (bio !== undefined && bio.length > 84) {
            return res.status(400).json({ message: 'Bio cannot exceed 84 characters' });
        }
    
        // prepare update object
        const updateData = {
            bio: bio !== undefined ? bio : user.bio, 
            userStatus: userStatus !== undefined ? userStatus : user.userStatus,
            studyAt: studyAt !== undefined ? studyAt : user.studyAt, 
            livesIn: livesIn !== undefined ? livesIn : user.livesIn, 
            workAt: workAt !== undefined ? workAt : user.workAt
        };
    
        if (workAt) {
            updateData.workAt = {
                companyName: workAt.companyName !== undefined ? workAt.companyName : (user.workAt?.companyName || ""),
                position: workAt.position !== undefined ? workAt.position : (user.workAt?.position || ""),
                cityOrTown: workAt.cityOrTown !== undefined ? workAt.cityOrTown : (user.workAt?.cityOrTown || "")
            };
        }

        const updatedUser = await Users.findByIdAndUpdate(userIdFormAuth, updateData, { 
            new: true 
        });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Updated successfully', userInfo: updatedUser });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


// update the user social media
const userSocials = async (req, res) => {
    const  userIdFormAuth = req.user.id;
    const { platFormName, url } = req.body;

    try {
        const user = await Users.findById(userIdFormAuth).exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.socials.push({ platFormName, url });

        await user.save();
        res.json({ message: 'Socials added successfully', socials: user.socials });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const followUser = async (req, res) => {
    const userIdFormAuth = req.user.id; 
    const { userIdToFollow } = req.body; 

    if (!userIdToFollow) {
        return res.status(400).json({ message: 'User ID to follow is required.' });
    }

    try {
        // check if the user is already following
        const user = await Users.findById(userIdFormAuth);

        if (user.following.includes(userIdToFollow)) {
            return res.status(400).json({ message: 'You are already following this user.' });
        }

        // follow the user
        await Users.findByIdAndUpdate(
            userIdFormAuth, 
            { $push: { following: userIdToFollow } }
        );
        await Users.findByIdAndUpdate(
            userIdToFollow, 
            { $push: { followers: userIdFormAuth } });

        return res.json({ message: 'Successfully followed the user.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const unfollowUser = async (req, res) => {
    const userIdFormAuth = req.user.id; 
    const { userIdToUnfollow } = req.body; 

    if (!userIdToUnfollow) {
        return res.status(400).json({ message: 'User ID to follow is required.' });
    }
    try {
        // check if the user is not following
        const user = await Users.findById(userIdFormAuth);
        if (!user.following.includes(userIdToUnfollow)) {
            return res.status(400).json({ message: 'You are not following this user.' });
        }

        // unfollow the user
        await Users.findByIdAndUpdate(userIdFormAuth, { $pull: { following: userIdToUnfollow } });
        await Users.findByIdAndUpdate(userIdToUnfollow, { $pull: { followers: userIdFormAuth } });

        return res.json({ message: 'Successfully unfollowed the user.' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error.' });
    }
}

const getUserFollowData = async (req, res) => {
    const userIdFormAuth = req.user.id;

    try {
        const user = await Users.findById(userIdFormAuth)
        .populate('followers', 
            'username firstName lastName middleName avatarUrl coverPhotoUrl livesIn'
        ) 
        .populate('following', 
            'username firstName lastName middleName avatarUrl coverPhotoUrl livesIn'
        ) 
        .select('followers following'); 

        return res.json({ 
            followers: user.followers, 
            following: user.following 
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

const suggestedFollowing = async (req, res) => {
    const { userId } = req.body.user;
    
    try {
        // Set up a query object to find users to suggest for following
        let queryObject = {};

        // Exclude the user themselves from the suggestions
        queryObject._id = { $ne: userId }; 

        // Exclude users that the user is already following
        const user = await Users.findById(userId).select('following');
        queryObject._id = { $ne: userId, $nin: user.following }; // Exclude already followed users

        // Perform the query to get suggested users
        const suggestedUsers = await Users.find(queryObject)
            .limit(15) // Limit to 15 suggestions
            .select("firstName lastName profileUrl profession -password"); // Select specific fields
        
            res.status(200).json({ data: suggestedUsers, });
       
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getAllUsers, getUserOrById, updateUser, userInfo, userSocials, followUser, unfollowUser, getUserFollowData, suggestedFollowing };




