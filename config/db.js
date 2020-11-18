const mongoose = require("mongoose")
const config = require("config")

const connectDB = async () => {
    try{
        await  mongoose.connect(process.env.mongoURI , {
            useNewUrlParser : true,
            useCreateIndex : true,
            useFindAndModify : false,
            useUnifiedTopology : true
        } );

        console.log("mongo connected")
    }
    catch(err){
        console.log(err.message)
        process.exit(1)
    }
}

module.exports = connectDB