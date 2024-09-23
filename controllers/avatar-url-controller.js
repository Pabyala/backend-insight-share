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
            // preset for unsigned uploads if required
            upload_preset: 'unsigned_upload',  
            // avatar file name
            public_id: `${user.username}_avatar`, 
            // specific image format
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