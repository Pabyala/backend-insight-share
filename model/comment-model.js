const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    postId: { type: Schema.Types.ObjectId, ref: 'Post' },
    comment: { type: String, required: true },
    from: { type: String, required: true },
    replies: [
        {
          rid: { type: mongoose.Schema.Types.ObjectId },
          userId: { type: Schema.Types.ObjectId, ref: "User" },
          from: { type: String },
          replyAt: { type: String },
          comment: { type: String },
          created_At: { type: Date, default: Date.now() },
          updated_At: { type: Date, default: Date.now() },
        //   likes: [{ type: String }],
        },
      ],
    // likes: [{ type: String }],
});

const postModel = mongoose.model("Comment", commentSchema);
module.exports = postModel;