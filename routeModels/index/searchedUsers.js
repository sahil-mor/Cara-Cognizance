const UserItem = require("../userItem/UserItem")
const User = require("../user/User")

const searchedUsers = async (req,res) => {
    try{
        var user = await User.findById(req.user.id)
        var userItem = await UserItem.findById(user.userItem)
        .populate({
            path : 'views',
            populate : {
              path : 'userItem',
            }
        })
        res.render("user/searchedUsers",{ title : "Searched Users", user , userItem })
    }catch(err){
        console.log(err)
        req.flash("error","Cannot load data right now!!!")
        res.redirect("/index")
    }
}

module.exports = searchedUsers