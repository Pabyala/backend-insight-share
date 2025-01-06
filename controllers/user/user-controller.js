const Follower = require('../../model/follower-model');
const Following = require('../../model/following-model');
const Users = require('../../model/user-model');
const cloudinary = require('../../config/cloudinary-con'); 
const { v4: uuidv4 } = require('uuid'); 

// git all the user //GOOD
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

// git user by id //GOOD
const getUserData = async (req, res) => {

    const userIdFormAuth = req.user.id;

    if(!userIdFormAuth) return res.status(401).json({ message: 'User not authenticated.' });

    try {
        const user = await Users.findById(userIdFormAuth)
        if (!user) {
            return res.status(404).json({ message: 'No user found..' })
        }
        res.json({ userInfo: user })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getUserById = async (req, res) => {
    const { userId } = req.params;

    if(!userId) return res.status(401).json({ message: 'Required user id.' });

    try {
        const user = await Users.findById(userId);
        if(!user) {
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


// update profile details //GOOD
const updateProfileDetails = async (req, res) => {
    const userIdFormAuth = req.user.id;
    const { livesIn, locFrom, isFollowedShow, studyAt, companyName, position, isDateBirthShow, socials , bio } = req.body;

    if (!userIdFormAuth) {
        return res.status(400).json({ message: 'You are not authorized to update this user.' });
    }

    try {
        const user = await Users.findById(userIdFormAuth);
        if (bio !== undefined && bio.length > 84) {
            return res.status(400).json({ message: 'Bio cannot exceed 84 characters' });
        }

        const updatedUserDetails = {
            bio: bio !== undefined ? bio : user.bio, 
            livesIn: livesIn !== undefined ? livesIn : user.livesIn,
            locFrom: locFrom !== undefined ? locFrom : user.locFrom,
            isFollowedShow: isFollowedShow !== undefined ? isFollowedShow : user.isFollowedShow,
            studyAt: studyAt !== undefined ? studyAt : user.studyAt,
            workAt: {
                position: position !== undefined ? position : user.position,
                companyName: companyName !== undefined ? companyName : user.companyName,
            },
            isDateBirthShow: isDateBirthShow !== undefined ? isDateBirthShow : user.isDateBirthShow,
        }

        // Handle the socials field
        if (Array.isArray(socials)) {
            // If socials are provided, replace the existing array
            updatedUserDetails.socials = socials.map(social => ({ url: social.url, urlId: social.urlId }));
        } else {
            // If no socials are provided, keep the existing array
            updatedUserDetails.socials = user.socials; // This line assumes user.socials is already an array
        }

        const updatedUser = await Users.findByIdAndUpdate(userIdFormAuth, updatedUserDetails, { new: true });

        return res.status(200).json({ message: 'Profile updated successfully.', updatedData: updatedUser });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}


// update the user info
const userInfo = async (req, res) => {
    const userIdFormAuth = req.user.id;
    const { livesIn,  studyAt, bio, userStatus, workAt } = req.body;

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
    const userIdFromAuth = req.user.id; 
    const { userIdToFollow } = req.params; 

    if (!userIdToFollow) {
        return res.status(400).json({ message: 'User ID to follow is required.' });
    }

    if (userIdFromAuth === userIdToFollow) {
        return res.status(400).json({ message: 'You cannot follow yourself.' });
    }

    try {
        // check if the user is already following
        const existingFollow = await Follower.findOne({
            follower: userIdFromAuth,
            following: userIdToFollow
        });

        if (existingFollow) {
            return res.status(400).json({ message: 'You are already following this user.' });
        }

        const followerRecord = await Follower.create({ follower: userIdFromAuth, following: userIdToFollow });

        const populatedFollower = await Follower.findById(followerRecord._id).populate('following', 'firstName middleName lastName username');

        return res.json({ message: 'Successfully followed the user.', followedUser: populatedFollower.following });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const unFollowUser = async (req, res) => {
    const userIdFromAuth = req.user.id; 
    const { userIdToUnFollow } = req.params; 

    if (!userIdToUnFollow) {
        return res.status(400).json({ message: 'User ID to unfollow is required.' });
    }

    try {
        const follow = await Follower.findOneAndDelete({
            follower: userIdFromAuth,
            following: userIdToUnFollow
        });

        if (!follow) {
            return res.status(400).json({ message: 'You are not following this user.' });
        }

        return res.json({ message: 'Successfully unfollowed  the user.' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error. Please try again later.' });
    }
}

const getFollowers = async (req, res) => {
    const userIdFromAuth = req.user.id;
    const { userId } = req.params;

    const userIdToUse = userId || userIdFromAuth;

    if(!userIdToUse) return res.status(400).json({ message: 'User is required.' });

    try {
        // const followers = await Follower.find({ following: userIdToUse }).populate('follower', 'username firstName middleName lastName avatarUrl');
        
        // return res.json({ message: 'Successfully fetched your follower', totalFollowers: followers.length,  yourFollowers: followers });

        // 1. Get all users who follow the authenticated user (followers)
        const followers = await Follower.find({ following: userIdToUse }).populate('follower', 'username firstName middleName lastName avatarUrl coverPhotoUrl');

        // 2. Get all users that the authenticated user is following
        const following = await Follower.find({ follower: userIdToUse }).populate('following', 'username firstName middleName lastName avatarUrl coverPhotoUrl');

        // 3. Convert to arrays of IDs for comparison
        const followerIds = followers.map(f => f.follower._id.toString());
        const followingIds = following.map(f => f.following._id.toString());

        // 4. Separate followers into groups
        const followersYouFollow = followers.filter(f => followingIds.includes(f.follower._id.toString()));  // Mutual followers
        const followersNotFollowingBack = followers.filter(f => !followingIds.includes(f.follower._id.toString()));  // Followers not followed back

        return res.json({
            message: 'Successfully fetched followers information.',
            // user that i following
            // totalOfMyFollowing: following.length,
            // myFollowing: following,

            // Mutual: Followers you follow back
            totalOfMutualFollowers: followersYouFollow.length,
            mutualFollowers: followersYouFollow.map(f => f.follower),

            // User you not follow back
            totalOfFollowersYouDontFollowingBack: followersNotFollowingBack.length,
            followersYouDontFollowingBack: followersNotFollowingBack.map(f => f.follower), 

            // Use followed me
            totalFollowers: followers.length,
            allFollowers: followers.map(f => f.follower),
            
        });

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

const getFollowing = async (req, res) => {
    const userIdFromAuth = req.user.id;
    const { userId } = req.params; 

    const userIdToUse = userId || userIdFromAuth;

    if(!userIdToUse) return res.status(400).json({ message: 'User is required.' });

    try {
        const following  = await Follower.find({ follower: userIdToUse }).populate('following', 'username firstName middleName lastName avatarUrl');
        
        return res.json({ message: 'Successfully fetched your follower',totalFollowing: following.length , youFollowed: following });
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

// update profileImg //GOOD
const handleChangeProfileImg = async (req, res) => {
    const { image } = req.body;
    const userId = req.user.id;
    
    try {
        if (!image) {
            return res.status(400).json({ error: 'Image is required.' }); 
        }
        const user = await Users.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
    
        const publicId = `${user.username}_${uuidv4()}`;
        const uploadedImage = await cloudinary.uploader.upload(image, {
            upload_preset: 'unsigned_upload_first',
            public_id: publicId, 
            allowed_formats: ['png', 'jpg', 'jpeg', 'svg'],
        });
        const imageUrl = uploadedImage.secure_url;
        user.avatarUrl = imageUrl;
        await user.save(); 
    
        res.status(200).json({ message: 'Image uploaded successfully', imageUrl });
    } catch (error) {
        console.log(error); 
        res.status(500).json({ error: 'Image upload failed.' });
    }
}

const handleChangeBackgroundPhoto = async (req, res) => {
    const { image } = req.body;
    const userId = req.user.id;
    
    try {
        if (!image) {
            return res.status(400).json({ error: 'Image is required.' }); 
        }
        const user = await Users.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
    
        const publicId = `bgPhoto${user.username}_${uuidv4()}`;
        const uploadedImage = await cloudinary.uploader.upload(image, {
            upload_preset: 'unsigned_upload_first',
            public_id: publicId, 
            allowed_formats: ['png', 'jpg', 'jpeg', 'svg'],
        });
        const imageUrl = uploadedImage.secure_url;
        user.coverPhotoUrl = imageUrl;
        await user.save(); 
    
        res.status(200).json({ message: 'Image uploaded successfully', imageUrl });
    } catch (error) {
        console.log(error); 
        res.status(500).json({ error: 'Image upload failed.' });
    }
}

const handleChangeName = async (req, res) => {
    const userIdFormAuth = req.user.id;
    const { firstName, middleName, lastName } = req.body;

    if (!firstName || !lastName) {
        return res.status(400).json({ message: "First name and last name are required." });
    }

    try {
        // Find and update the user's name fields.
        const user = await Users.findById(userIdFormAuth);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        user.firstName = firstName;
        user.middleName = middleName || user.middleName;
        user.lastName = lastName;

        // Save the updated document
        const updatedUser = await user.save();

        return res.status(200).json({
            message: "Name updated successfully.",
            updatedUser: {
                firstName: updatedUser.firstName,
                middleName: updatedUser.middleName,
                lastName: updatedUser.lastName
            },
        });
    } catch (error) {
        console.error("Error updating name:", error);
        res.status(500).json({ message: "An error occurred while updating the name." });
    }
}


const handleChangeUserName = async (req, res) => {
    const userIdFormAuth = req.user.id;
    const { username } = req.body;

    if(!username) {
        return res.status(400).json({ message: "First username are required." });
    }

    
    try {
        const user = await Users.findById(userIdFormAuth);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        user.username

        const updatedUser = await user.save();

        return res.status(200).json({
            message: "Username updated successfully.",
            updatedUser: {
                username: updatedUser.username
            },
        });

    } catch (error) {
        console.error("Error updating name:", error);
        res.status(500).json({ message: "An error occurred while updating the name." });
    }
    
}



module.exports = {
    getAllUsers, 
    getUserData, 
    getUserById,
    updateUser, 
    userInfo, 
    userSocials, 
    followUser, 
    unFollowUser, 
    getFollowers, 
    getFollowing, 
    suggestedFollowing, 
    updateProfileDetails,
    handleChangeProfileImg,
    handleChangeBackgroundPhoto,
    handleChangeName,
    handleChangeUserName,
};




