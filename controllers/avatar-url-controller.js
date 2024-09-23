const User = require('../model/user-model');
const cloudinary = require('../config/cloudinary-con')

const uploadAvatarUlr = async (req, res) => {
    const { image } = req.body;
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const result = await cloudinary.uploader.upload(image, {
            upload_preset: 'unsigned_upload',  // Preset for unsigned uploads if required
            public_id: `${user.username}_avatar`,  // Make sure username is defined
            allowed_formats: ['png', 'jpg', 'jpeg', 'svg']
        });

        user.avatarUrl = result.secure_url;
        await user.save();
        
        res.json({ success: true, avatarUrl: result.secure_url });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Image upload failed' });
    }
}

module.exports = { uploadAvatarUlr };