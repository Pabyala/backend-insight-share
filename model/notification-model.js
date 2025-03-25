const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    senderId: { type: Schema.Types.ObjectId, required: true, ref: 'Users' }, // Reference User model
    receiverId: { type: Schema.Types.ObjectId, required: true, ref: 'Users' },
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'Users' },
    postId: { type: Schema.Types.ObjectId, ref: 'Posts', required: false },
    type: String, // e.g., "reaction", "comment"
    commentId: { type: Schema.Types.ObjectId, ref: 'Comments' },
    commentContext: String,
    message: String,
    typeOfNotification: String,
    isRead: { type: Boolean, default: false },
    }, { 
        timestamps: true 
    }
);

const notificationModel = mongoose.model("Notification", notificationSchema);
module.exports = notificationModel;