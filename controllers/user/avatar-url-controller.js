// controllers/uploadController.js
const User = require('../../model/user-model');
const cloudinary = require('../../config/cloudinary-con');

// Function to upload image to Cloudinary
const uploadImageToCloudinary = (image) => {
    return new Promise((resolve, reject) => {
        const opts = {
            upload_preset: 'unsigned_upload1',
            folder: 'IS_User_Avatar1',
            public_id: 'avatar', // Consider using a unique public_id for each user
            allowed_formats: ['png', 'jpg', 'jpeg', 'svg'],
        };

        cloudinary.uploader.upload(image, opts, (error, result) => {
            if (error) {
                console.error("Cloudinary Upload Error:", error.message);
                return reject({ message: error.message });
            }
            console.log("Uploaded Image URL:", result.secure_url);
            return resolve(result.secure_url);
        });
    });
};

// Controller for handling the profile picture update
const uploadAvatarUrl = async (req, res) => {
    const userId = req.user.id;

    // Ensure the image is present in the request body
    const { profilePreviewUrl } = req.body; // Assuming profilePreviewUrl contains the image data

    if (!profilePreviewUrl) {
        return res.status(400).json({ message: 'No image data provided' });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Upload image to Cloudinary
        const avatarUrl = await uploadImageToCloudinary(profilePreviewUrl);

        // Update user's avatar URL in the database
        user.avatarUrl = avatarUrl;
        await user.save();

        res.json({ success: true, avatarUrl });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Image upload failed' });
        console.error("Error updating your profile:", error);
    }
};

// Export the controller functions
module.exports = { uploadAvatarUrl };