const OTP = require("../OTP/OTP")

const resetPasswordFunc = async (req,res) => {
    const {otpId } = req.params
    const { enteredOtp } = req.body
    try{
        var otpObject = await OTP.findById(otpId).populate("user")

        var diff =(otpObject.timeOfSending - Date.now() ) / 1000;
        diff /= (60 * 60);
        diff < 0 ? diff = -diff : diff = diff;
        diff = Math.floor(diff);

        if(diff >= 1){
            var removed = await OTP.findByIdAndRemove(otpId)
            req.flash("error","Your OTP has been expired !!!")
            res.redirect("/")
        }else{
            var { user } = otpObject
            if( otpObject.otp != enteredOtp ){
                req.flash("error","Entered OTP is wrong !!!")
                res.redirect(`/resetPassword-${otpId}`)
            }else{
                var removed = await OTP.findByIdAndRemove(otpId)
    
                res.redirect(`/setPassword-${user.id}`)
            }
        }

    }catch(err){
        console.log(err)
        req.flash("error","Cannot reset your password right now !!!")
        res.redirect(`/resetPassword-${otpId}`)
    }
}

module.exports = resetPasswordFunc