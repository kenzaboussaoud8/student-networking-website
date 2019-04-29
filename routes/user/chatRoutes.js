const express = require("express");
const bodyParser = require("body-parser");
const  mongoose  = require("mongoose");

// // Connecting to the mongo database
const chats = require("../../mongo/chatSchema")
// const  url  =  "mongodb://localhost:8080/chat";

const connect = mongoose.connect('mongodb://localhost/KenzaB', { useNewUrlParser: true },
    function (err) { console.log((err) ? err : 'MongoDB Connection successful') });

const router = express.Router();
router.get('/');

// Router
module.exports = router => {
    router.get("/chat", getMessages);
    console.log('hey')
    return router;
  };


function getMessages(req, res, next){
        res.setHeader("Content-Type", "application/json");
        res.statusCode = 200;
      
        connect.then(db => {
          let data = chats.find({ message: "Anonymous" });
          chats.find({}).then(chat => {
            res.json(chat);
          });
        });
      };

