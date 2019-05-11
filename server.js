// Initializing an instance of Express
const express = require('express')
const expressApp = express()
const bodyParser = require('body-parser')
const http = require('http')
const cors = require('cors')
const path = require('path')

// Autoriser un accès public à l'API
expressApp.use(function (request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization ");
    response.header("Access-Control-Allow-Methods", 'PUT, POST, GET, DELETE');
    response.header('Access-Control-Allow-Credentials', true);
    next();
});
// Set the bodyParser to parse the urlencoded post data
expressApp.use(bodyParser.urlencoded({ extended: true }))

const authRoutes = require('./routes/user/userRoutes')(express.Router())
const chatRoutes = require('./routes/user/chatRoutes')(express.Router())

// Set the authRoutes for registration and & login requests
expressApp.use('/', authRoutes)
expressApp.use('/', chatRoutes)
// Serving static files
expressApp.use(express.static(path.join(__dirname, 'public')));
//
expressApp.get('/', function(req, res){
    res.redirect('index.html');
  });

// admin access
  expressApp.get('/helpdesk', function(req, res){
    res.redirect('index-admin.html');
  });
// Setting up the connexion to the mongo database
const  mongoose  = require("mongoose");
mongoose.Promise  = require("bluebird");


// Requiring socket.io
const io = require("socket.io")
const socket = io(http);


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