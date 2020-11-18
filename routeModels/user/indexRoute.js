var User = require("./User")

indexRoute = (req,res) => {
    User.findById(req.user.id)
    .populate("familyMembers")
    .exec(function(err,user) {
        if(err){
            console.log(err)
            req.flash("error","Unexpected Error Occured!!!")
            res.redirect("/")
        }else{
            if(user.isAuthorised){
                res.redirect("/authorised/index")
            }else{
                res.render("user/home",{ user : user, title : "Home" })
            }
        }
    })
}
module.exports = indexRoute