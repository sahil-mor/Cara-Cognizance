var User = require("../user/User")
var ImageLink = require("../imagesLink/imageLink")


const searchItem = async (req,res) => {
    try{
        var user = await User.findById(req.user.id)
        var imagesLinks = await ImageLink.find({})

        res.render("searchItem",{ title : "Search",user, imagesLinks })

    }
    catch(err){
        console.log(err)
        req.flash("error","Cannot Load Data From Database")
        res.redirect("/index")
    }
}
module.exports = searchItem