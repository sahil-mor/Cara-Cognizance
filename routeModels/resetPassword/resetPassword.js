const OTP = require("../OTP/OTP")

const resetPassword = async (req,res) => {
    const { otpId } = req.params
    try{
        var otp = await OTP.findById(otpId).populate("user")

        var { user } = otp
        var forRegister = false, forAuthorised = false
        res.render("auth/lockscreen",{ title : "Reset Password", user , otp ,forRegister,forAuthorised })

    }catch(err){
        console.log(err)
        req.flash("error","Cannot reset password right now !!!")
        res.redirect("/")
    }
}

module.exports = resetPassword