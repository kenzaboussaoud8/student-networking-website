const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// // Connecting to the mongo database
const Chat = require("../../mongo/chatSchema").Chat
    // const  url  =  "mongodb://localhost:8080/chat";

module.exports = {
    getMessages: getMessages,
    saveMessage: saveMessage
};


const connect = mongoose.connect('mongodb://localhost/KenzaB', { useNewUrlParser: true },
    function(err) {
        if (err) {
            console.log(err);
            return;
        }
        console.log('MongoDB Connection successful')
    });

function getMessages(req, res, next) {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;

    connect.then(db => {
        Chat.find({ sender: "Anonymouks" }).then(chat => {
            console.log("chat", chat)
            res.json(chat);
        });
    });
};

function saveMessage(message) {
    //save chat to the database
    connect.then(db => {
        console.log("connected correctly to the server");
        console.log("saving message", message);
        let chatMessage = new Chat;
        chatMessage.message = message.message;
        chatMessage.sender = message.sender;
        chatMessage.receiver = message.receiver;
        chatMessage.save(function(err) {
            if (err) {
                console.log("Can't save message to db", err)
                return;
            }
        });
    });
}