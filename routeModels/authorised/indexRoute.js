var User = require("../user/User")
var ImageLink = require("../imagesLink/imageLink")

indexRoute = (req,res) => {
    User.findById(req.user.id)
    .exec( async (err,user) => {
        if(err){
            console.log(err)
            req.flash("error","Unexpected Error Occured!!!")
            res.redirect("/authorised/login")
        }else{
            var imagesLinks = await ImageLink.find({})
    
            res.render("searchItem",{ title : "Home",user, imagesLinks  })
            
        }
    })
}
module.exports = indexRoute