const User = require("../user/User")

const setPassword = async (req,res) => {
    const { userID } = req.params
    const { password } = req.body
    try{
        var user = await User.findById(userID)


        await user.setPassword(password)

        var savedUser = await user.save()

        var updated = await User.findByIdAndUpdate(userID,savedUser)

        req.flash("success","Please login to continue !!!")
        res.redirect("/")

    }catch(err){
        console.log(err)
        req.flash("error","Cannot reset your password right now!!!")
        res.redirect("/")
    }
}

module.exports = setPassword