var User = require("../user/User")
var UserItem = require("../userItem/UserItem")
const uuid = require("uuid")

const viewItem = async (req,res) => {
    var { userItemId } = req.params
    try {
        var user = await User.findById(req.user.id)
        var userItem = await UserItem.findById(userItemId).populate("parent")
        var userItem2 = null
        var canEdit = false
        var isAuthorised = false
        if(user.isAuthorised){
            isAuthorised = true
            res.render("viewItem",{ user , userItem ,isAuthorised, canEdit, title : `${userItem.name}` })
        }
        else{
            var found = user.familyMembers.includes(userItemId)
        

            if( user.userItem == userItemId || found ){
                canEdit = true
                userItem2 = userItem
            }else{
                var currentUserItem = await UserItem.findById(user.userItem)
                userItem.viewedBy.unshift({
                    userItem : currentUserItem
                })
                var savedData = await userItem.save()
                currentUserItem.views.unshift({
                    userItem,
                    randomId : uuid.v4()
                })
                var savedData2 = await currentUserItem.save()
                userItem2 = {
                    name : userItem.name,
                    id : userItem.id,
                    image : userItem.image
                }
            }
            res.render("viewItem",{ user , userItem : userItem2 ,isAuthorised, canEdit, title : `${userItem.name}` })
        }

    } catch (error) {
        console.log(error)
        req.flash("error","You cannot access this page!!!")
        res.redirect("/index")
    } 
}
module.exports = viewItem