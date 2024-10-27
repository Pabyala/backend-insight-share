const cloudinary = require('../../config/cloudinary-con'); 
const Users = require('../../model/user-model');
const { v4: uuidv4 } = require('uuid'); 

const handleImg = async (req, res) => { 
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
};

module.exports = { handleImg }; 
