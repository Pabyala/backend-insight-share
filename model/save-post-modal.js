const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const savePostSchema = new Schema({
    postId: { type: Schema.Types.ObjectId, required: true, ref: 'Posts' },
    userSaved: { type: Schema.Types.ObjectId, required: true, ref: 'Users' }
    },{ 
        timestamps: true 
    }
);

const postModel = mongoose.model("savedPosts", savePostSchema);
module.exports = postModel;