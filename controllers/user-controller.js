const User = require('../model/user-model');

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

const getUserById = async (req, res) => {
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

const updateUser = async (req, res) => {
    // id from auth
    const  userIdFormAuth = req.user.id;
    const { username, firstName, middleName, lastName, email, gender, phoneNumber, dateOfBirth, bio, userStatus } = req.body;
    const { userId } = req.params;

    if (!userId) return res.status(400).json({ message: 'User ID is required' });
    if (!userIdFormAuth) return res.status(400).json({ message: 'You are not authorized to update this user.' });

    try {
        const user = await User.findById(userId).exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // update the users fields
        if (username) user.username = username;
        if (firstName) user.firstName = firstName;
        if (middleName) user.middleName = middleName;
        if (lastName) user.lastName = lastName;
        if (email) user.email = email;
        if (gender) user.gender = gender;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (dateOfBirth) user.dateOfBirth = dateOfBirth;
        if (bio !== undefined) user.bio = bio; 
        if (userStatus !== undefined) user.userStatus = userStatus; 

        // check if the new email and phone number is already exist, excluding the current user.
        const emailDuplicate = await User.findOne({ email, _id: { $ne: userId } }).exec();
        const phoneNumDuplicate = await User.findOne({ phoneNumber, _id: { $ne: userId }}).exec();

        if (emailDuplicate) return res.status(400).json({ message: 'Email already exist.' });
        if (phoneNumDuplicate) return res.status(400).json({ message: 'Phone number already exist.' });

        await user.save();

        res.json({ message: 'Updated successfully' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getAllUsers, getUserById, updateUser };




