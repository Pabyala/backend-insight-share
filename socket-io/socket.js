const { Server } = require('socket.io');
const http = require('http'); // Import http module
const express = require('express');
const allowedOrigins = require('../config/allowed-origins');

const app = express();

const server = http.createServer(app); 
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true 
    }
}); 

// Store connected users
const connectedUsers = new Map();

io.on('connection', (socket) => {
    console.log('A user connected: ', socket.id)

    // Register user when they connect
    socket.on('register', (userId) => {
        connectedUsers.set(userId, socket.id);
    });

    // Emit notification to post author
    socket.on('sendNotification', ({ recipientId, message, postId }) => {
        const recipientSocketId = connectedUsers.get(recipientId);
        if (recipientSocketId) {
            io.to(recipientSocketId).emit('newNotification', { message, postId });
        }
    });

    socket.on("newNotification", (notification) => {
        io.to(notification.userId).emit("newNotification", notification);
    });

    // Remove user from connected list when they disconnect
    socket.on('disconnect', () => {
        connectedUsers.forEach((socketId, userId) => {
            if (socketId === socket.id) {
                connectedUsers.delete(userId);
            }
        });
        console.log("User disconnected", socket.id);
    });
});


module.exports = { app, io, server };