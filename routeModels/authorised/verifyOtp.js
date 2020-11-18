var OTP = require("../OTP/OTP")

const verifyOtp = async (req,res ) => {
    const { otpId } = req.params
    try{
        var otp = await OTP.findById(otpId)

        if(!otp){
            req.flash("error","Cannot verify your account right now !!!")
            res.redirect("/authorised")
        }

        if(!otp.isAuthorised){
            res.redirect(`/verifyOtp-${otp.id}`)
        }

        var user = {
            username : otp.username,
            image : otp.image
        }
        var forAuthorised = true , forRegister = false
        res.render("auth/lockscreen",{ title : "Account Verification", user , otp ,forAuthorised,forRegister })

    }catch(err){
        console.log(err)
        req.flash("error","Cannot verify your account right now !!!")
        res.redirect("/authorised")
    }
}

module.exports = verifyOtp