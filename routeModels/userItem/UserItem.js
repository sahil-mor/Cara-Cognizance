const mongoose = require("mongoose")

const UserItemSchema = mongoose.Schema({
    name : {
        type : String,
    },
    email : {
        type : String,
    },
    parent :  {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    image : {
        imageUrl : String,
        cloudinary_id : String
    },
    dateOfBirth : {
        type : Date,
    },
    phoneNumber : String,
    address : String,
    viewedBy : [
        {
            userItem :  { 
                type : mongoose.Schema.Types.ObjectId,
                ref : "UserItem"
            },
            date : {
                type : Date,
                default : Date.now
            }
        }
    ],
    views : [
        {
            userItem :  { 
                type : mongoose.Schema.Types.ObjectId,
                ref : "UserItem"
            },
            date : {
                type : Date,
                default : Date.now
            },
            randomId : {
                type : String,
            }
        }
    ],
    imageLink : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "ImageLink"
    },
    date : {
        type : Date,
        default : Date.now
    },
})


module.exports = mongoose.model("UserItem",UserItemSchema)