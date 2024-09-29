const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'Users' },
    postId: { type: Schema.Types.ObjectId, ref: 'Posts' },
    comment: { type: String, required: true },
    from: { type: String, required: true },
    replies: [
        {
          rid: { type: mongoose.Schema.Types.ObjectId },
          userId: { type: Schema.Types.ObjectId, ref: "Users" },
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

const postModel = mongoose.model("Comments", commentSchema);
module.exports = postModel;