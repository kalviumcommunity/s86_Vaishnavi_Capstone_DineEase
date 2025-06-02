const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');


dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());


app.get('/', (req, res) => {
    res.send("Welcome");
});

// Connect to MongoDB
connectDB();



//Routes

//user routes
const userRoutes = require('./routes/userRoutes')
app.use('/api/users', userRoutes);

//bookings routes(user-side)
const bookingRoutes = require('./routes/bookingRoutes');
app.use('/api/bookings', bookingRoutes);

//admin routes
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admins', adminRoutes);


//infoHub routes
const infoHubRoutes = require('./routes/infoHubRoutes');
app.use('/api/infohub', infoHubRoutes);


//table routes 
const tableRoutes = require('./routes/tableRoutes');
app.use('/api/tables', tableRoutes);


app.listen(PORT, () => {
    console.log(`Server is live at http://localhost:${PORT}`);
});
