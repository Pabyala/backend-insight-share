const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const followerSchema = new Schema({
    follower: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    following: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    }, { 
        timestamps: true 
    }
);

const followerModel = mongoose.model("Follower", followerSchema);
module.exports = followerModel;