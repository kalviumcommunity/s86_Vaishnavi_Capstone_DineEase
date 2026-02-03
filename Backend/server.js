const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');


dotenv.config();

const app = express();
const PORT = 3000; // localhost port value

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'https://vaishnavi-dineease.vercel.app'],
    credentials: true
}));
app.use(express.json());

// Serve static files for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.get('/', (req, res) => {
    res.send("Welcome to DineEase");
});

// Connect to MongoDB
connectDB();


//auth routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth',authRoutes);


//user routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/user', userRoutes);

//bookings routes(user-side)
const bookingRoutes = require('./routes/bookingRoutes');
app.use('/api/bookings', bookingRoutes);

//restaurant routes
const restaurantRoutes = require('./routes/restaurantRoutes');
app.use('/api/restaurants', restaurantRoutes);


//table routes 
const tableRoutes = require('./routes/tableRoutes');
app.use('/api/tables', tableRoutes);


const passport = require("passport");
require("./config/passport");

app.use(passport.initialize());



app.listen(PORT, () => {
    console.log(`Server is live at http://localhost:${PORT}`);
});
