const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    authorId: { type: Schema.Types.ObjectId, required: true, ref: 'Users' },
    captionPost: { type: String, required: true },
    reactions: {
        like: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
        heart: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
        wow: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
        angry: [{ type: Schema.Types.ObjectId, ref: 'Users' }]
    },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comments" }],
    }, { 
        timestamps: true 
    }
);

const postModel = mongoose.model("Posts", postSchema);
module.exports = postModel;