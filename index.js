const express = require('express');
const mongoose = require('mongoose');
require("dotenv").config();
const cors = require('cors');
const connectDB = require('./config/database-con');
const corsOptions = require('./config/cors-options');
const verifyJWT = require('./middleware/verify-jwt');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const PORT = process.env.PORT

connectDB();

// const http = require('http'); // Import http module
// const { Server } = require('socket.io');
// const allowedOrigins = require('./config/allowed-origins');
const { server, app } = require('./socket-io/socket-setup');

app.use(credentials)
app.use(cors(corsOptions));

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: true , limit: '50mb'}))
app.use(cookieParser());

app.use('/v1/signup', require('./routes/register'));
app.use('/v1/auth', require('./routes/auth'));
app.use('/v1/refresh', require('./routes/refresh'));
app.use('/v1/logout', require('./routes/logout'));

// protected routes
app.use(verifyJWT);
app.use('/v1/post', require('./routes/api/posts'));
app.use('/v1/comment', require('./routes/api/comment'));
app.use('/v1/user', require('./routes/api/users'));
app.use('/v1/birthday', require('./routes/api/birthday'));
app.use('/v1/profile', require('./routes/api/password'));
app.use('/v1/notification', require('./routes/api/notification'));

mongoose.connection.once('open', () => {
  console.log("Connected to MongoDB");
  // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});