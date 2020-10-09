const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({

    //User schema:
    username : {
        type: String,
        require:true,
    },
    email : {
        type:String,
        require:true,
    },
    password : {
        type:String,
        require:true
    },
    friendship : [String],
    time : { 
        type : Date, 
        default: Date.now 
    }
});




module.exports = new mongoose.model('user',userSchema);
