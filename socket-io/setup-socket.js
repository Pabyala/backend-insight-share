const { Server } = require("socket.io");
const Notification = require("../model/notification-model");

const setupSocket = async (server) => {
    const io = new Server(server, {
        cors: {
            origin: ["http://localhost:3000", "https://www.yoursite.com"],
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        socket.on("sendNotification", async (data) => {
            const { senderId, receiverId, type, postId, message } = data;

            try {
                const notification = new Notification({ senderId, receiverId, type, postId, message });
                await notification.save();
                io.emit(`notification:${receiverId}`, notification);
            } catch (error) {
                console.error("Error saving notification:", error);
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });

    return io;
};

module.exports = setupSocket;