const User = require("../user/User")

const setPassword = async (req,res) => {
    const { userID } = req.params
    try{
        var user = await User.findById(userID)

        res.render("auth/setPassword",{ title : "Set Password", user })

    }catch(err){
        console.log(err)
        req.flash("error","Cannot reset your password right now!!!")
        res.redirect("/")
    }
}

module.exports = setPassword