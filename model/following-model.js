const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const followingSchema = new Schema({
    following: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    follower: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    }, { 
        timestamps: true 
    }
);

const followingModel = mongoose.model("Following", followingSchema);
module.exports = followingModel;