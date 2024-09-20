const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config({ path: './Database/.env' }); // Adjust path if necessary

const dbconnect = require('./Database/db'); // Path to your db connection module
const userroute = require("./Route/userroute");
const blogroute = require("./Route/blogroute");
const socketroute = require("./Route/socketroute");
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');

// Initialize Express app
const app = express();
const port = process.env.PORT || 5000;

// Middleware for parsing cookies
app.use(cookieParser());

// CORS options
const corsOptions = {
  origin: 'https://blog-frontend-eight-rosy.vercel.app',  // The URL of your frontend

   methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
   Headers: true,
  
    methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"], // Allow only specified HTTP methods
    allowedHeaders: [
      "Access-Control-Allow-Origin",
      "Content-Type",
      "Authorization",
      "cookies",
    ],
    credentials: true, // Allow sending cookies and other credentials
    optionsSuccessStatus: 200,
    preflightContinue: false,

};

// Apply CORS middleware globally
app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
dbconnect();

// Route definitions (ensure paths are correct)
app.use("/api/vi", userroute); // Removed extra slashes to ensure proper pathing
app.use("/api/vi", blogroute);
app.use("/api/vi", socketroute);

// Create HTTP server for WebSocket integration
const server = http.createServer(app);

// Set up Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: 'https://blog-frontend-eight-rosy.vercel.app',  // Must match frontend URL
    credentials: true,  // Necessary for allowing cookies over WebSocket
  },
});

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
