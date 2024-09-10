const express = require('express');
var cors = require('cors')
const mongoose = require('mongoose');
require('dotenv').config({ path: './Database/.env' }); // Adjust path if necessary

const dbconnect = require('./Database/db'); // Path to your db connection module
const userroute=require("./Route/userroute");
const blogroute=require("./Route/blogroute")
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 5000;
app.use(cookieParser());

//--cors policy----

app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend's URL
  credentials: true, // Allow sending cookies
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
dbconnect();

//----route-------

app.use("/api/vi/",userroute)
app.use("/api/vi/",blogroute);

// Start the server
app.listen(port, () => {
    console.log(`> Server is up and running on port: ${port}`);
});
