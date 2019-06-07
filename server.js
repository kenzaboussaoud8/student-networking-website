// Initializing an instance of Express
const express = require("express");
const expressApp = express();
const bodyParser = require("body-parser");
const http = require("http");
const cors = require("cors");
const path = require("path");

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

const userRoutes = require("./routes/user/userRoutes")(express.Router());
const chatRoutes = require("./routes/user/chatRoutes")(express.Router());
const adminRoutes = require("./routes/admin/adminRoutes")(express.Router());

// Set the authRoutes for registration and & login requests
expressApp.use("/", userRoutes);
expressApp.use("/", adminRoutes);
// Serving static files
expressApp.use(express.static(path.join(__dirname, "public")));
//
expressApp.get("/", function(req, res) {
    res.redirect("index.html");
});

// admin access
expressApp.get("/helpdesk", function(req, res) {
    res.redirect("index-admin.html");
});

// Include the node file module
var fs = require('fs');

// Include ImageMagick
var im = require('imagemagick');

// Post files
expressApp.post('/upload', function(req, res) {
  fs.readFile(req.files.image.path, function (err, data) {
    var imageName = req.files.image.name
    /// If there's an error
    if(!imageName){
      console.log("There was an error")
      res.redirect("/");
      res.end();
    } else {
      var newPath = __dirname + "/uploads/fullsize/" + imageName;
      var thumbPath = __dirname + "/uploads/thumbs/" + imageName;
      // write file to uploads/fullsize folder
      fs.writeFile(newPath, data, function (err) {
        // write file to uploads/thumbs folder
        im.resize({
          srcPath: newPath,
          dstPath: thumbPath,
          width:   200
        }, function(err, stdout, stderr){
          if (err) throw err;
          console.log('resized image to fit within 200x200px');
        });
         res.redirect("/uploads/fullsize/" + imageName);
      });
    }
  });
});

// Show files
expressApp.get('/uploads/fullsize/:file', function (req, res){
  file = req.params.file;
  var img = fs.readFileSync(__dirname + "/uploads/fullsize/" + file);
  res.writeHead(200, {'Content-Type': 'image/jpg' });
  res.end(img, 'binary');
});

expressApp.get('/uploads/thumbs/:file', function (req, res){
  file = req.params.file;
  var img = fs.readFileSync(__dirname + "/uploads/thumbs/" + file);
  res.writeHead(200, {'Content-Type': 'image/jpg' });
  res.end(img, 'binary');
});


// Setting up the connexion to the mongo database
const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

// Requiring socket.io
const io = require("socket.io");
const socket = io(http);

// Set the server to listen to messages
socket.on("connection", socket => {
    console.log("user connected");
    socket.on("disconnect", function() {
        console.log("user disconnected");
    });
    socket.on("chat message", function(msg) {
        console.log("message: " + msg);
        //broadcast message to everyone in port:5000 except yourself.
        socket.broadcast.emit("received", { message: msg });

        //save chat to the database
        connect.then(db => {
            console.log("connected correctly to the server");

            let chatMessage = new Chat({ message: msg, sender: "Anonymous" });
            chatMessage.save();
        });
    });
});

// Listening to port
const PORT = 8080;
expressApp.listen(PORT, function() {
    console.log("Server is running on Port", PORT);
});