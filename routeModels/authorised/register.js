var passport = require("passport")

var User = require("../user/User")
var OTP = require("../OTP/OTP")
const nodemailer = require('nodemailer');

const user = process.env.EMAIL_ID 
const pass = process.env.PASSWORD

const auth = {
    user ,
    pass  
}

var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

const register = async (req,res) => {
    const {username,email,password,confirmPassword} = req.body
    const imageUrl = "https://res.cloudinary.com/dl3mvgfqz/image/upload/v1605605730/ppupkcvzznejm0c6tylm.png"
    const cloudinary_id = "ppupkcvzznejm0c6tylm"
    const image = {
        imageUrl,
        cloudinary_id
    }
    if(password !== confirmPassword ){
        req.flash("error","PASSWORD ARE NOT THE SAME")
        res.redirect("/authorised/register")
    }else{
        try{ 
            var users = await User.findOne({ email })
            if(users){
                req.flash("error","EMAIL ALREADY IN USE")
                res.redirect("/authorised/register")
            } 
            
            users = await User.findOne({ username })
            if(users){
                req.flash("error","USERNAME ALREADY IN USE")
                res.redirect("/authorised/register")
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
                subject: 'Cara Cognizance | Verify Authorised Account',
                text: "Hi," + "\n\n" + 
                "To proceed further with your authorised account verification at Cara , Please use the OTP given below.This OTP is only valid for 60 minutes."
                + "\n\n" + 
                "OTP : " + otp + " \n\n" + 
                "Regards,\n" +
                "Team ,Cara"
            }
    
            var response = await smtpTrans.sendMail(mailOpts)
            var isAuthorised = true
            var otpCreated = await OTP.create({
                timeOfSending : Date.now(),
                otp ,
                username,
                email,
                password,
                image,
                isAuthorised
            })
            req.flash("success",`Enter OTP sent to provided email`)
            res.redirect(`/authorised/verifyOtp-${otpCreated.id}`)

        }
        catch(err){
            console.error(err)
            req.flash("error","Cannot Verify Your Account !!!")
            res.redirect("/authorised/register")
        }
    }
}
module.exports = register