const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config({ path: './Database/.env' }); // Adjust path if necessary
const session = require('express-session');
const passport = require('passport');
const dbconnect = require('./Database/db'); // Path to your db connection module
const userroute = require("./Route/userroute");
const blogroute = require("./Route/blogroute");
const socketroute = require("./Route/socketroute");
const userauthroute = require("./Route/userauthroute");
const cookieParser = require('cookie-parser');
const userauthcontroller=require("./Controller/userauthcontroller")
const http = require('http');
const { Server } = require('socket.io');

// Initialize Express app
const app = express();
const port = process.env.PORT || 5000;

// Middleware for parsing cookies
app.use(cookieParser());

// CORS options
const corsOptions = {
  origin: 'https://new-sooty-xi.vercel.app/',  // The URL of your frontend

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
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret',  // Use env variable
    resave: false,  // Prevent session resaving if not modified
    saveUninitialized: false,  // Don't create session until something is stored
    cookie: { secure: process.env.NODE_ENV === 'production' }  // Set to true if using HTTPS in production
}));

app.use(passport.initialize());
app.use(passport.session());

// Middleware to parse JSON bodies


// Connect to MongoDB
dbconnect();

require("./Controller/userauthcontroller")

// Route definitions (ensure paths are correct)
app.use("/api/vi", userroute); // Removed extra slashes to ensure proper pathing
app.use("/api/vi", blogroute);
app.use("/api/vi", socketroute);
app.use('/api/auth', userauthroute); 

// Create HTTP server for WebSocket integration
const server = http.createServer(app);

// Set up Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: 'https://new-sooty-xi.vercel.app',  // Must match frontend URL
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
