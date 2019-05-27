const mongoosePackage = require('mongoose');
const Schema = mongoose.Schema;
const chatSchema = new Schema(
    {
        message: {
            type: String
        },
        sender: {
            type: String
        }
    },
        {
            timestamps: true

    });

let Chat = mongoosePackage.model('chat', chatSchema);
module.exports = Chat;
