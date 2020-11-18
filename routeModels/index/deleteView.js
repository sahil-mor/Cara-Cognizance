const User = require("../user/User")
const UserItem = require("../userItem/UserItem")

const deleteView = async (req,res) => {
    const {randomID} = req.body
    try{
        const user = await User.findById(req.user.id)
        const userItem = await UserItem.findById(user.userItem)

        var { views } = userItem

        var currentIndex = 0
        var requiredValue = views.filter( each => {
            if(each.randomID != randomID ){
                currentIndex += 1
            }
            return each.randomID == randomID
        } )

        if(currentIndex > -1){
            views.splice(currentIndex,1)
        }

        userItem.views = views

        await userItem.save()

        res.redirect("/searchedUsers")

    }catch(err){
        console.log(err)
        req.flash("error","Cannot delete right now")
        res.redirect("/searchedUsers")
    }
}

module.exports = deleteView