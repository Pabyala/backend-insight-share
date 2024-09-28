const express = require('express');
const mongoose = require('mongoose');
require("dotenv").config();
const cors = require('cors');
const app = express();
const connectDB = require('./config/database-con');
const corsOptions = require('./config/cors-options');
const verifyJWT = require('./middleware/verify-jwt');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT;

// connect to db
connectDB();

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser())

app.use('/v2/signup', require('./routes/register'));
app.use('/v1/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

app.use(verifyJWT);
app.use('/v1/post', require('./routes/api/posts'));
app.use('/v1/', require('./routes/api/users'));
app.use('/v1/profile/', require('./routes/api/password'));

mongoose.connection.once('open', () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});