const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const chatSchema = new Schema({
    message: {
        type: String
    },
    sender: {
        type: String
    },
    receiver: {
        type: String
    }
}, {
    timestamps: true
});

let chat = mongoose.model("chat", chatSchema);
module.exports = { Chat: chat };