// Initializing an instance of Express
const express = require("express");
const expressApp = express();
const bodyParser = require("body-parser");
const http = require("http");
var server = http.createServer(expressApp);
const cors = require("cors");
const path = require("path");
const router = express.Router();
var multer = require('multer');
// Autoriser un accès public à l'API
expressApp.use(function(request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept,Authorization "
    );
    response.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE");
    response.header("Access-Control-Allow-Credentials", true);
    next();
});
// Set the bodyParser to parse the urlencoded post data
expressApp.use(bodyParser.urlencoded({ extended: true }));

const userRoutes = require("./routes/user/userRoutes")(router);
const chatRoutes = require("./routes/user/chatRoutes")(router);
const adminRoutes = require("./routes/admin/adminRoutes")(router);

// Set the authRoutes for registration and & login requests
expressApp.use("/", userRoutes);
expressApp.use("/", adminRoutes);
expressApp.use("/", chatRoutes);
// Serving static files
expressApp.use(express.static(path.join(__dirname, "public")));
expressApp.use(express.static(path.join(__dirname, "uploads")));

//
expressApp.get("/", function(req, res) {
    res.redirect("/user/index.html");
});

// admin access
expressApp.get("/helpdesk", function(req, res) {
    res.redirect("/admin/login.html");
});

// upload files
var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './uploads');
    },
    filename: function(req, file, callback) {
        const studentcardFilename = req.body.email + '-' + Date.now();
        req.body.student_card = studentcardFilename;
        callback(null, studentcardFilename);
    }
});

var upload = multer({ storage: storage }).single('studentCard');

expressApp.post('/upload', function(req, res) {
    upload(req, res, function(err) {
        if (err) {
            return res.end("Error uploading file.");
        }
        req.url = "/register";
        router.handle(req, res, function() {});
    });
});
// Setting up the connexion to the mongo database
const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

// Requiring socket.io
console.log("Setting up socket.io")
const io = require("socket.io");
const chatUtils = require("./routes/user/chatUtils");
const socket = io(server);

// Set the server to listen to messages
socket.on("connection", socket => {
    console.log("socket: user connected");
    // TODO: save in logged in table
    socket.on("disconnect", function() {
        console.log("socket: user disconnected");
        // TODO: drop from logged in table
    });
    socket.on("chat message", function(msg) {
        console.log("message: " + msg);
        let chatMessage = { message: msg.message, sender: msg.sender, receiver: msg.receiver }
            // broadcast message to everyone in port:5000 except yourself.
        socket.emit("message", chatMessage);
        socket.broadcast.emit("message", chatMessage);
        chatUtils.saveMessage(chatMessage);
    });
});

// Listening to port
const PORT = 8080;
server.listen(PORT, function() {
    console.log("Server is running on Port", PORT);
});

server.listen(3000, function() {
    console.log('listening on *:3000');
});