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
    avatarUrl: { type: String, default: "https://res.cloudinary.com/dcebzsr1c/image/upload/v1737277802/iamlostmann_e4af3d58-10b2-4e75-8a5e-b346bdbe7d21.jpg" },
    avatarPublicId: { type: String, default: "" }, 
    coverPhotoUrl: { type: String, default: "https://res.cloudinary.com/dcebzsr1c/image/upload/v1730115926/bgPhotosanjiikon_c9ae7709-809c-4900-bfe9-af961dfc6256.jpg" },
    coverPhotoPublicId: { type: String, default: "" }, 
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
    lastLogin: { type: Date, default: Date.now },
    isVerified: { type: Boolean, default: false },
    resetPasswordToken: { type: String },
    resetPasswordExpiresAt: { type: Date },
    verificationToken: { type: String },
    verificationExpiresAt: { type: Date },
    followers: [{ type: Schema.Types.ObjectId, ref: "Users" }],
    following: [{ type: Schema.Types.ObjectId, ref: "Users" }],
    refreshToken: { type: String }
    }, { 
        timestamps: true 
    }
)

const UserModel = mongoose.model("Users", userSchema);
module.exports = UserModel;