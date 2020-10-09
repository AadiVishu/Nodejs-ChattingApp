const mongoose = require('mongoose');
//FriendRequest schema:
const FriendRequestSchema = new mongoose.Schema({
    pendingRequest : {
        type: String,
        required:true
    },
    acceptedRequest : {
        type: String,
        required:true
    },
    status : {
        type : String,
        required : true
    }
})

module.exports = new mongoose.model('friendship',FriendRequestSchema);