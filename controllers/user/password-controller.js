const User = require('../../model/user-model');
const bcrypt = require('bcrypt');

// update password
const updatePassword = async (req, res) => {
    const { userId } = req.params;
    const { oldPassword, newPassword } = req.body;

    if (!userId) return res.status(400).json({ message: 'User ID is required' });
    if (!oldPassword || !newPassword) return res.status(400).json({ message: 'Old and new passwords are required' });

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect current password' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { updatePassword }; 