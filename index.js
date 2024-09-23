const express = require('express');
const mongoose = require('mongoose');
require("dotenv").config();
const cors = require('cors');
const app = express();
const connectDB = require('./config/database-con');
const corsOptions = require('./config/cors-options');
const verifyJWT = require('./middleware/verify-jwt');

// connect to db
connectDB();

app.use(express.json());
app.use(cors(corsOptions));

// .env
const PORT = process.env.PORT;

app.get('/', (req, res) => {
  res.send('Hello, World, nice!!');
});

app.use('/v1/signup', require('./routes/register'));
app.use('/v1/auth', require('./routes/auth'));

app.use('/v1/post', require('./routes/api/posts'));
app.use('/v1/', require('./routes/api/users'));
app.use('/v1/profile/', require('./routes/api/password'));

mongoose.connection.once('open', () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});