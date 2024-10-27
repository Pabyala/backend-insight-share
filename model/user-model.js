const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true },
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    gender: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    dateOfBirth: { type: String, required: true },//
    isDateBirthShow: { type: Boolean, default: true },//
    isFollowedShow: { type: Boolean, default: true },//
    bio: { type: String, maxlength: 84 },//
    userStatus: { type: String, },
    avatarUrl: { type: String, default: "" },
    coverPhotoUrl: { type: String, default: "" },
    livesIn: { type: String, },//
    locFrom: { type: String, },//profilePreviewUrl
    studyAt: { type: String, }, //
    workAt: {
        companyName: { type: String, },//
        position: { type: String, }//
    },
    socials: [{
        urlId: { type: String, },//
        url: { type: String, }//
    }],
    followers: [{ type: Schema.Types.ObjectId, ref: "Users" }],
    following: [{ type: Schema.Types.ObjectId, ref: "Users" }],
    refreshToken: { type: String }
    }, { 
        timestamps: true 
    }
)

const UserModel = mongoose.model("Users", userSchema);
module.exports = UserModel;