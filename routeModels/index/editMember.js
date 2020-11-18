var User = require("../user/User")
var UserItem = require("../userItem/UserItem")

const editMember = async (req,res) => {
    try{
        var user = await User.findById(req.user.id)
        var userItem = await UserItem.findById(req.params.userItemId)
        res.render("user/editMember",{ title : "Edit Memeber", user , userItem })
    }
    catch(err){
        console.log(err)
        req.flash("error","Cannot Load Data From Database")
        res.redirect("/index")
    }
}
module.exports = editMember