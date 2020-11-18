var OTP = require("../OTP/OTP")

const verifyOtp = async (req,res ) => {
    const { otpId } = req.params
    try{
        var otp = await OTP.findById(otpId)

        if(!otp){
            req.flash("error","Cannot verify your account right now !!!")
            res.redirect("/")
        }
        if(otp.isAuthorised){
            res.redirect(`/authorised/verifyOtp-${otp.id}`)
        }else{
            var user = {
                username : otp.username,
                image : otp.image
            }
            var forRegister = true ,forAuthorised = false
            res.render("auth/lockscreen",{ title : "Account Verification", user , otp ,forRegister ,forAuthorised })
        }

    }catch(err){
        console.log(err)
        req.flash("error","Cannot verify your account right now !!!")
        res.redirect("/")
    }
}

module.exports = verifyOtp