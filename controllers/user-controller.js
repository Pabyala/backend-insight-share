const User = require('../model/user-model');

// git all the user
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        if (!users) {
            return res.status(404).json({ message: 'No users found' })
        }
        res.json({ allUsers: users })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// git user by id
const getUserById = async (req, res) => {
    // id from user auth
    const  userIdFormAuth = req.user.id;
    const { userId } = req.params;

    if (!userId) return res.status(400).json({ message: 'Id parameter is required' });

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'No user found' })
        }
        res.json({ userInfo: user })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// update the user profile
const updateUser = async (req, res) => {
    // id from user auth
    const  userIdFormAuth = req.user.id;
    const { username, firstName, middleName, lastName, email, gender, phoneNumber, dateOfBirth, bio, userStatus } = req.body;

    if (!userIdFormAuth) return res.status(400).json({ message: 'You are not authorized to update this user.' });

    try {
        const user = await User.findById(userIdFormAuth).exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // update the users fields
        if (username) user.username = username;
        if (firstName) user.firstName = firstName;
        if (middleName) user.middleName = middleName;
        if (lastName) user.lastName = lastName;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (gender) user.gender = gender;
        if (dateOfBirth) user.dateOfBirth = dateOfBirth;
        if (bio !== undefined) user.bio = bio; 
        if (userStatus !== undefined) user.userStatus = userStatus; 

        // check if the new email and phone number is already exist, excluding the current user.
        const emailDuplicate = await User.findOne({ email, _id: { $ne: userIdFormAuth } }).exec();
        const phoneNumDuplicate = await User.findOne({ phoneNumber, _id: { $ne: userIdFormAuth }}).exec();

        if (emailDuplicate) return res.status(400).json({ message: 'Email already exist.' });
        if (phoneNumDuplicate) return res.status(400).json({ message: 'Phone number already exist.' });

        await user.save();

        res.json({ message: 'Updated successfully' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// update the user full name
const updateUserName = async (req, res) => {
    // id from user auth
    const  userIdFormAuth = req.user.id;
    const { username, firstName, middleName, lastName, gender } = req.body;

    if (!userIdFormAuth) return res.status(400).json({ message: 'You are not authorized to update this user.' });

    try {
        const user = await User.findById(userIdFormAuth).exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // update the users fields
        if (username) user.username = username;
        if (firstName) user.firstName = firstName;
        if (middleName) user.middleName = middleName;
        if (lastName) user.lastName = lastName;
        if (gender) user.gender;

        await user.save();

        res.json({ message: 'Updated successfully' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// update the user email and phone num
const updateUserEmailPhoneNum = async (req, res) => {
    // id from user auth
    const  userIdFormAuth = req.user.id;
    const { email, phoneNumber } = req.body;

    if (!userIdFormAuth) return res.status(400).json({ message: 'You are not authorized to update this user.' });

    try {
        const user = await User.findById(userIdFormAuth).exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber; 

        // check if the new email and phone number is already exist, excluding the current user.
        const emailDuplicate = await User.findOne({ email, _id: { $ne: userIdFormAuth } }).exec();
        const phoneNumDuplicate = await User.findOne({ phoneNumber, _id: { $ne: userIdFormAuth }}).exec();

        if (emailDuplicate) return res.status(400).json({ message: 'Email already exist.' });
        if (phoneNumDuplicate) return res.status(400).json({ message: 'Phone number already exist.' });

        await user.save();
        res.json({ message: 'Updated successfully' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// update the user bday
const updateUserBday = async (req, res) => {
    // id from user auth
    const  userIdFormAuth = req.user.id;
    const { dateOfBirth } = req.body;

    if (!userIdFormAuth) return res.status(400).json({ message: 'You are not authorized to update this user.' });

    try {
        const user = await User.findById(userIdFormAuth).exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        if (dateOfBirth) user.dateOfBirth = dateOfBirth;

        await user.save();
        res.json({ message: 'Updated successfully' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// update the user bio
const updateUserBio = async (req, res) => {
    // id from user auth
    const  userIdFormAuth = req.user.id;
    const { bio } = req.body;

    if (!userIdFormAuth) return res.status(400).json({ message: 'You are not authorized to update this user.' });

    try {
        const user = await User.findById(userIdFormAuth).exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        if (bio !== undefined) user.bio = bio; 

        await user.save();
        res.json({ message: 'Updated successfully' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// update the user status
const updateUserStatus = async (req, res) => {
    // id from user auth
    const  userIdFormAuth = req.user.id;
    const { userStatus } = req.body;

    if (!userIdFormAuth) return res.status(400).json({ message: 'You are not authorized to update this user.' });

    try {
        const user = await User.findById(userIdFormAuth).exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (userStatus !== undefined) user.userStatus = userStatus; 

        await user.save();
        res.json({ message: 'Updated successfully' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getAllUsers, getUserById, updateUser, updateUserName, updateUserEmailPhoneNum, updateUserBday, updateUserBio, updateUserStatus };




