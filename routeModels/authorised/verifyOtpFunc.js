var passport = require("passport")
var OTP = require("../OTP/OTP")
var User = require("../user/User")

const verifyOtpFunc = async (req,res) => {
    var { enteredOtp } = req.body
    var { otpId } = req.params
    try{
        var otpObject = await OTP.findById(otpId)
        if(!otpObject){
            req.flash("error","Cannot verify your account right now !!!")
            res.redirect("/register")
        }

        var diff =(otpObject.timeOfSending - Date.now() ) / 1000;
        diff /= (60 * 60);
        diff < 0 ? diff = -diff : diff = diff;
        diff = Math.floor(diff);

        if(diff >= 1){
            var removed = await OTP.findByIdAndRemove(otpId)
            req.flash("error","Your OTP has been expired !!!")
            res.redirect("/register")
        }else{
            if( otpObject.otp != enteredOtp ){
                req.flash("error","Entered OTP is wrong !!!")
                res.redirect(`/authorised/verifyOtp-${otpId}`)
            }else{
                const { username , email , image , isAuthorised, password } = otpObject
                var removed = await OTP.findByIdAndRemove(otpId)
                var newUser = await User.register({ username , email , image , isAuthorised }, password ) 
            
                passport.authenticate("local");
                req.flash("success","Please signin to continue !!!")
                res.redirect("/authorised" )            
            }
        }
    }  catch(err){

    }


    
}

module.exports = verifyOtpFunc