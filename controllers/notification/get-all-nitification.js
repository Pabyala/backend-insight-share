const Notification = require("../../model/notification-model"); 

const getNotifications = async (req, res) => {
    const { userId } = req.params; 

    if (!userId) {
        return res.status(400).json({ message: "User ID is required." });
    }

    try {
        // Fetch notifications for the user
        const notifications = await Notification.find({ receiverId: userId })
            .sort({ createdAt: -1 }) // Newest notifications first
            .limit(50) // Optional: Limit to 50 recent notifications
            .populate({
                path: "senderId",
                select: "username firstName middleName lastName avatarUrl coverPhotoUrl",
            })
            .populate({
                path: "receiverId",
                select: "username firstName middleName lastName avatarUrl coverPhotoUrl",
            })
            .populate({
                path: "postId", 
                select: "captionPost", 
            })
            .populate({
                path: "commentId", // Populate the comment details
                select: "comment from replies",
                populate: [
                    {
                        path: "from", // Populate comment author details
                        select: "username firstName lastName avatarUrl",
                    },
                    {
                        path: "replies.userId", // Populate reply authors inside the comment
                        select: "username firstName lastName avatarUrl",
                    }
                ]
            });

            // Keep notifications that either have a postId or are of type 'follow'
            const filteredNotifications = notifications.filter(
                (notification) => notification.postId !== null || notification.type === 'follow'
            );

        res.status(200).json({ notifications: filteredNotifications });
    } catch (error) {
        res.status(500).json({ message: "An error occurred while retrieving notifications." });
    }
};

module.exports = getNotifications;