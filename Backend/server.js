const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');


dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());


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
app.use('/api/restaurant', restaurantRoutes);


//table routes 
const tableRoutes = require('./routes/tableRoutes');
app.use('/api/tables', tableRoutes);


const passport = require("passport");
require("./config/passport");

app.use(passport.initialize());



app.listen(PORT, () => {
    console.log(`Server is live at http://localhost:${PORT}`);
});
