// Initializing an instance of Express
const express = require('express')
const expressApp = express()

// Requiring socket.io
const io = require("socket.io")
const socket = io(http);

const bodyParser = require('body-parser')
// Set the bodyParser to parse the urlencoded post data
expressApp.use(bodyParser.urlencoded({ extended: true }))

const authRoutes = require('./routes/user/userRoutes')(express.Router())

// Set the authRoutes for registration and & login requests
expressApp.use('/auth', authRoutes)


// set the server to listen to messages
socket.on("connection", (socket) =>{
    console.log("user is connected");
})

// Listening to port
const PORT = 8080;
expressApp.listen(PORT, function() {
    console.log('Server is running on Port', PORT);
});