const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const shipmentRoutes = require('./routes/shipmentRoutes');
const adminRoutes = require('./routes/adminRoutes')
const passport = require("./config/passport");
const session = require("express-session");
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');
const cloudinary = require('./utils/cloudinaryConfig');
const cookieParser = require('cookie-parser');
const app = express();
const port = process.env.port || 5000;
app.use(cors({ origin: process.env.FRONTEND_URL,credentials:true }));
app.use(express.json());

app.use(cookieParser());
app.use(session({ secret: process.env.JWT_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
dotenv.config();
// console.log(cloudinary);

mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use('/',shipmentRoutes);
app.use('/admin',adminRoutes);
app.use('/user',userRoutes);
app.use('/auth',authRoutes);

app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
})