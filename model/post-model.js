const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    // authorName: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    authorId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    captionPost: { type: String, required: true },
    reactions: {
        like: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        heart: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        wow: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        angry: [{ type: Schema.Types.ObjectId, ref: 'User' }]
    },
    // reactions: { /* reactions schema */ },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    }, { 
        timestamps: true 
    }
);

const postModel = mongoose.model("Post", postSchema);
module.exports = postModel;