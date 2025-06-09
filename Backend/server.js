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


app.listen(PORT, () => {
    console.log(`Server is live at http://localhost:${PORT}`);
});
