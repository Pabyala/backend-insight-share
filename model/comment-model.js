const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    postId: { type: Schema.Types.ObjectId, ref: 'Posts' },
    comment: { type: String, required: true },
    from: { type: Schema.Types.ObjectId, ref: 'Users' },
    replies: [
        {
          rid: { type: mongoose.Schema.Types.ObjectId },
          userId: { type: Schema.Types.ObjectId, ref: "Users" },
          from: { type: String },
          replyAt: { type: String },
          comment: { type: String },
          createdAt: { type: Date, default: Date.now() },
          updatedAt: { type: Date, default: Date.now() },
          heart: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
        },
      ],
    heart: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
    }, { 
      timestamps: true 
    }
);

const postModel = mongoose.model("Comments", commentSchema);
module.exports = postModel;