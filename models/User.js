const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    phone : {
        type : String,
        default : ""
    },
    address : {
        type : String,
        default : ""
    },
    pincode : {
        type : String,
        default : ""
    }
    
}, {timestamps: true});

export default mongoose.models.User ||mongoose.model('User', userSchema);