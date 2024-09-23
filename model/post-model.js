const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const postSchema = new Schema({
    authorName: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    authorId: { type: String, required: true },
    content: { type: String, required: true },
    reactions: {
        like: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        heart: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        wow: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        angry: [{ type: Schema.Types.ObjectId, ref: 'User' }]
    },
    // reactions: { /* reactions schema */ },
    comments: [commentSchema],
    }, { 
        timestamps: true 
    }
);

const postModel = mongoose.model("Post", postSchema);
module.exports = postModel;