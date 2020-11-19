var User = require("../user/User")
var ImageLink = require("../imagesLink/imageLink")

indexRoute = (req,res) => {
    User.findById(req.user.id)
    .exec( async (err,user) => {
        if(err){
            console.log(err)
            req.flash("error","Unexpected Error Occured!!!")
            res.redirect("/authorised")
        }else{
            if(user.isAuthorised){
                var imagesLinks = await ImageLink.find({})
    
                res.render("searchItem",{ title : "Home",user, imagesLinks  })
            }else{
                req.logout();
                req.flash("error","USERNAME OR PASSWORD IS WRONG")
                res.redirect("/authorised")
            }            
        }
    })
}
module.exports = indexRoute