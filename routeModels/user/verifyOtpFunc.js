var passport = require("passport")

var User = require("./User")
var UserItem = require("../userItem/UserItem")
var ImageLink = require("../imagesLink/imageLink")
var OTP = require("../OTP/OTP")

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
                res.redirect(`/verifyOtp-${otpId}`)
            }else{
                var removed = await OTP.findByIdAndRemove(otpId)

                const { username , email,image, password,isAuthorised } = otpObject
                const { imageUrl } = image
                
                var newUser = await User.register({ username , email,image, isAuthorised }, password ) 
            
                var newImageLink = await ImageLink.create({
                    imageUrl ,
                    name : username
                })
            
                var userItem = await UserItem.create( {
                    name : username,
                    email,
                    parent : newUser.id,
                    image ,
                    imageLink : newImageLink
                } )
                newUser.userItem = userItem
                newImageLink.userItem = userItem
            
                await newImageLink.save()
                await newUser.save()
                passport.authenticate("local");
                req.flash("success","Please signin to continue !!!")
                res.redirect("/" )            
            }
        }
    
    }
    catch(err){
        console.log(err)
        req.flash("error","Cannot verify your account right now !!!")
        res.redirect("/register")
    }
    
}

module.exports = verifyOtpFunc