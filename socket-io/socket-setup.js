const { Server } = require('socket.io');
const http = require('http');
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

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('registerUser', (userId) => {
        users[userId] = socket.id;
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

module.exports = { app, io, server };