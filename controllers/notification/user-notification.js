const Notification = require("../../model/notification-model");


const getNotification = async (req, res) => {
    const { userId } = req.params; // Get the user ID from request params

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

            // const filteredNotifications = notifications.filter(notification => notification.postId !== null);

            // Keep notifications that either have a postId or are of type 'follow'
            const filteredNotifications = notifications.filter(
                (notification) => notification.postId !== null || notification.type === 'follow'
            );

        res.status(200).json({ notifications: filteredNotifications });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ message: "An error occurred while retrieving notifications." });
    }
};

const markOneNotification = async (req, res) => {
    const { notificationId } = req.params;

    if (!notificationId) {
        return res.status(400).json({ message: "Notification ID is required." });
    }

    try {
        // Find the notification first
        const notification = await Notification.findById(notificationId);

        if (!notification) {
            return res.status(404).json({ message: "Notification not found." });
        }

        // Check if it's already read
        if (notification.isRead) {
            return res.status(200).json({ message: "Notification is already marked as read." });
        }

        // If it's unread, update it
        notification.isRead = true;
        await notification.save();

        res.status(200).json({ message: "Notification marked as read.", notification });
    } catch (error) {
        console.error("Error marking notification as read:", error);
        res.status(500).json({ message: "An error occurred while updating the notification." });
    }
}

const markAllReadNotification = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required." });
    }

    try {
        // Update all notifications where the receiverId matches the userId
        const result = await Notification.updateMany(
            { receiverId: userId, isRead: false }, 
            { $set: { isRead: true } }
        );

        if (result.modifiedCount === 0) {
            return res.status(200).json({ message: "No unread notifications found." });
        }

        res.status(200).json({ message: "All notifications marked as read." });
    } catch (error) {
        console.error("Error marking notifications as read:", error);
        res.status(500).json({ message: "An error occurred while updating notifications." });
    }
};

module.exports = { 
    getNotification,
    markAllReadNotification,
    markOneNotification
};