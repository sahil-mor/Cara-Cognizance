const mongoose = require("mongoose")

const imagesLinks = mongoose.Schema({
    imageUrl : String,
    userItem : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "UserItem",
    },
    name : String
})


module.exports = mongoose.model("ImageLink",imagesLinks)