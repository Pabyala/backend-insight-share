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
const handleUserAvatar = require('./controllers/user/handleUserAvatar');
const PORT = process.env.PORT;
const cloudinary = require('./config/cloudinary-con'); // Ensure correct path
const User = require('./model/user-model'); // Ensure correct path

// connect to db
connectDB();

app.use(credentials)
app.use(cors(corsOptions));
// built-in middleware to handle urlencoded form data
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());
// app.use(cookieParser())

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
app.use('/v1/user', require('./routes/api/users'));
app.use('/v1/profile', require('./routes/api/password'));
app.post("/uploadImage", (req, res) => {
  const { image } = req.body; // Ensure you destructure image from req.body
  uploadImage(image)
      .then((url) => res.send(url))
      .catch((err) => res.status(500).send(err));
});

const opts = {
  overwrite: true,
  invalidate: true,
  resource_type: "auto",
};

const uploadImage = (image) => {
  return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(image, opts, (error, result) => {
          if (result && result.secure_url) {
              console.log(result.secure_url);
              return resolve(result.secure_url);
          }
          console.log(error.message);
          return reject({ message: error.message });
      });
  });
};


mongoose.connection.once('open', () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});