const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
    sender : {
        type:String,
        required:true,
    },
    reciever : {
        type:String,
        requireed:true,
    },
    time : {
        type:Date,
        default:Date.now()
    }
});

module.exports = new mongoose.model('message', messageSchema);