const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const shipmentRoutes = require('./routes/shipmentRoutes');
const adminRoutes = require('./routes/adminRoutes')
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');
 
const app = express();
const port = process.env.port || 5000;
app.use(cors({ origin: "http://localhost:5173",credentials:true }));
app.use(express.json());
const cookieParser = require('cookie-parser');
app.use(cookieParser());

dotenv.config();


mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use('/',shipmentRoutes);
app.use('/admin',adminRoutes);
app.use('/user',userRoutes);

app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
})