const express = require('express');
var cors = require('cors')
const mongoose = require('mongoose');
require('dotenv').config({ path: './Database/.env' }); // Adjust path if necessary

const dbconnect = require('./Database/db'); // Path to your db connection module
const userroute=require("./Route/userroute");
const blogroute=require("./Route/blogroute")
const socketroute = require("./Route/socketroute");
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const port = process.env.PORT || 5000;
app.use(cookieParser());

//--cors policy----

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',  // The URL of your frontend (adjust as necessary)
    credentials: true,  // This is necessary for allowing cookies to be sent
  },
});

const corsOptions = {
  origin: 'http://localhost:3000',  // The URL of your frontend (adjust as necessary)
  credentials: true,  // This is necessary for allowing cookies to be sent
};

app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
dbconnect();

//----route-------

app.use("/api/vi/",userroute)
app.use("/api/vi/",blogroute);
app.use("/api/vi/",socketroute)



// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('New client connected', socket.id);

  // Listen for user connection with userId (when user logs in)
  socket.on('userConnected', (userId) => {
    console.log(`User ${userId} connected with socket ID: ${socket.id}`);
    socket.join(userId); // Join room with userId to send personal messages
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});


// Start the server
server.listen(port, () => {
    console.log(`> Server is up and running on port: ${port}`);
});
