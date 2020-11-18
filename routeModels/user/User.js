const mongoose = require("mongoose")

var passportLocalMongoose = require("passport-local-mongoose")
const UserSchema = mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
    },
    isAuthorised : {
        type : Boolean,
        required : true    
    },
    familyMembers : [
        { 
            type : mongoose.Schema.Types.ObjectId,
            ref : "UserItem"
        }
    ],
    userItem :  {
        type : mongoose.Schema.Types.ObjectId,
        ref : "UserItem"
    },
    image : {
        imageUrl : String,
        cloudinary_id : String
    },
    otp : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "OTP"
    },
    date : {
        type : Date,
        default : Date.now
    }
})


UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User",UserSchema)