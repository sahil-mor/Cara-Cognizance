var User = require("../user/User")

const addMember = async (req,res) => {
    try{
        var user = await User.findById(req.user.id)
        res.render("user/addMember",{ title : "Add Memeber", user : user })
    }
    catch(err){
        console.log(err)
        req.flash("error","Cannot Load Data From Database")
        res.redirect("/index")
    }
}
module.exports = addMember