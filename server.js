// Initializing an instance of Express
const express = require('express')
const expressApp = express()
const bodyParser = require('body-parser')
// Set the bodyParser to parse the urlencoded post data
expressApp.use(bodyParser.urlencoded({ extended: true }))

const authRoutes = require('./routes/user/userRoutes')(express.Router())

// Set the authRoutes for registration and & login requests
expressApp.use('/auth', authRoutes)

// Setting up the connexion to the mongo database
const  mongoose  = require("mongoose");
mongoose.Promise  = require("bluebird");


// Requiring socket.io
const io = require("socket.io")
const socket = io(http);

// Connecting to the mongo database
const chat = require("./mongo/chat")
const  url  =  "mongodb://localhost:8080/chat";
const  connect  =  mongoose.connect(url, { useNewUrlParser: true  });


// Set the server to listen to messages
socket.on("connection", socket  =>  {
    console.log("user connected");
    socket.on("disconnect", function() {
    console.log("user disconnected");
    });  
    socket.on("chat message", function(msg) {
        console.log("message: "  +  msg);
        //broadcast message to everyone in port:5000 except yourself.
    socket.broadcast.emit("received", { message: msg  });

    //save chat to the database
    connect.then(db  =>  {
    console.log("connected correctly to the server");

    let  chatMessage  =  new Chat({ message: msg, sender: "Anonymous"});
    chatMessage.save();
    });
    });
});
// Listening to port
const PORT = 8080;
expressApp.listen(PORT, function() {
    console.log('Server is running on Port', PORT);
});