const express = require('express');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const logsIngestion = require('./routes/logsRoutes');

// Connection string for local MongoDB (faster response)
// const DBSTRING = 'mongodb://127.0.0.1:27017/log-ingestor-pr';

// Connection string for MongoDB Atlas (cloud storage, slower response)
const DBSTRING = 'mongodb+srv://root:root@cluster5.19oto3i.mongodb.net/log-ingestor-pr';

// Connect to MongoDB
mongoose.connect(DBSTRING, () => {
    console.log('MongoDB connected');
}, (error) => {
    console.log('Error occurred while connecting to the database:', error);
});

// Define the server port
const PORT = 3000;

// Create an Express app
const app = express();
const server = http.createServer(app);

// Configure CORS for Socket.IO
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3456",
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Enable CORS for Express
app.use(cors());

// Parse incoming JSON requests
app.use(bodyParser.json());

// Define routes for logs ingestion
app.use('/', logsIngestion(io));

// Handle Socket.IO connections and disconnections
io.on('connection', (socket) => {
    console.log('Client connected');

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`The server is running on port: ${PORT}`);
});
