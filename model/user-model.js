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
    bio: { type: String },
    userStatus: { type: String },
    avatarUrl: { type: String, default: '' },
    refreshToken: { type: String }
    }, { 
        timestamps: true 
    }
)

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;