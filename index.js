const express = require('express');
const mongoose = require('mongoose');
require("dotenv").config();
const cors = require('cors');
const app = express();
const connectDB = require('./config/database-con');
const corsOptions = require('./config/cors-options');
const verifyJWT = require('./middleware/verify-jwt');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const PORT = process.env.PORT;
const http = require('http'); // Import http module
const { Server } = require('socket.io');
const { MailtrapClient } = require("mailtrap");
const { VERIFICATION_EMAIL_TEMPLATE1 } = require('./mail-trap/email-html-template');
const { createVerificationEmail, sendVerificationEmail } = require('./mail-trap/email-service')
const Nodemailer = require("nodemailer");

const server = http.createServer(app); // Create an HTTP server
const io = new Server(server, {
  cors: {
    // origin: corsOptions.origin, // Directly use the origin function from corsOptions
    origin: ['http://localhost:3000', 'https://www.yoursite.com'],
    methods: ['GET', 'POST']
  }
});
// Make io accessible to routes/middleware via app.set()
app.set('socketio', io);

connectDB();

app.use(credentials)
app.use(cors(corsOptions));
// built-in middleware to handle urlencoded form data
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());
// app.use(cookieParser())


// const TOKEN = "a0819b72dfbaea730d5a9477616b1d94";

// const client = new MailtrapClient({
//     token: TOKEN,
// });

// const sender = {
//     email: "hello@demomailtrap.com",
//     name: "Mailtrap Test",
// };
// const recipients = [
//     {
//         email: "eleomarfaafajutnao@gmail.com",
//     }
// ];

// client
//     .send({
//         from: sender,
//         to: recipients,
//         subject: "You are awesome!",
//         html: VERIFICATION_EMAIL_TEMPLATE1,
//         category: "Integration Test",
//     })
//     .then(console.log, console.error);




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


mongoose.connection.once('open', () => {
  console.log("Connected to MongoDB");
  // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});