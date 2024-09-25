const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true },
    firstName: { type: String, required: true },
    middleName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    gender: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    dateOfBirth: { type: String, required: true },
    bio: { type: String, default: '', maxlength: 84 },
    userStatus: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
    coverPhotoUrl: { type: String, default: '' },
    livesIn: { type: String, default: '' },
    studyAt: { type: String, default: '' },
    workAt: {
        companyName: { type: String, default: '' },
        position: { type: String, default: '' },
        cityOrTown: { type: String, default: '' }
    },
    socials: [{
        platFormName: { type: String, default: '' },
        url: { type: String, default: '' }
    }],
    refreshToken: { type: String }
    }, { 
        timestamps: true 
    }
)

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;