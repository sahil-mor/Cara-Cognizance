const User = require("../user/User")
const OTP = require("../OTP/OTP")

const nodemailer = require('nodemailer');

const user = process.env.EMAIL_ID 
const pass = process.env.PASSWORD

const auth = {
    user ,
    pass  
}

var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

const forgotPasswordFunc = async (req,res) => {
    const { email } = req.body
    try{
        var user = await User.findOne({ email })

        if(!user){
            req.flash("error","No user found for given email")
            res.redirect("/")
        }

        const smtpTrans = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth 
        })
        var otp = ""
        for(var i = 0 ; i < 6; i++ ){
            var randomIndex = Math.floor(Math.random() * 62)
            otp += characters[randomIndex]
        }

        const mailOpts = {
            from: "Cara Cognizance",
            to : email,
            subject: 'Cara Cognizance | Reset Password',
            text: "Hi," + "\n\n" + 
            "To reset your password at Cara Cognizance, please use the OTP given below.This OTP is only valid for 60 minutes."
            + "\n\n" + 
            "OTP : " + otp + " \n\n" + 
            "Regards,\n" +
            "Team ,Cara"
        }

        var response = await smtpTrans.sendMail(mailOpts)

        var otpCreated = await OTP.create({
            timeOfSending : Date.now(),
            otp ,
            user
        })

        if(user.otp){
            // delete this otp
            var otpId = user.otp
            await OTP.findByIdAndRemove(otpId)
        }
        
        user.otp = otpCreated
        var savedUser = await user.save()
        await User.findByIdAndUpdate(user.id,savedUser)

        res.redirect(`/resetPassword-${otpCreated.id}`)
        
    }
    catch(err){
        console.log(err)
        req.flash("error","Cannot reset your password right now!!!")
        res.redirect("/")
    }
}

module.exports = forgotPasswordFunc