const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    authorId: { type: Schema.Types.ObjectId, required: true, ref: 'Users' },
    captionPost: { type: String, required: true },
    reactions: {
        like: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
        fire: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
        handsUp: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
        disLike: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
        heart: [{ type: Schema.Types.ObjectId, ref: 'Users' }]
    },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comments" }],
    }, { 
        timestamps: true 
    }
);

const postModel = mongoose.model("Posts", postSchema);
module.exports = postModel;