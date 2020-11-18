var mongoose = require("mongoose")
var userSchema = require("./User")
var passport = require("passport")
User = mongoose.model("User",userSchema)
var dateformat = require('dateformat')

var otpSchema = require("../otp/otpSchema")
var OTP = mongoose.model("OTP",otpSchema)
var nodemailer = require('nodemailer');
var otp;
const register = async (req,res) => {
    if(req.body.confirmPassword !== req.body.password ){
        req.flash("error","PASSWORD ARE NOT THE SAME")
        res.redirect("/register")
    }else{
        newUser = {
            username : req.body.username, email : req.body.email,password : req.body.password
        }
        try{
            var users = await User.findOne({ email : newUser.email })
            if(users){
                req.flash("error","EMAIL ALREADY IN USE")
                res.redirect("/register")
            } 
            
            users = User.findOne({username : newUser.username})
            if(users){
                req.flash("error","USERNAME ALREADY IN USE")
                res.redirect("/register")
            }
          
            // const smtpTrans = nodemailer.createTransport({
            //     host: 'smtp.gmail.com',
            //     port: 465,
            //     secure: true,
            //     auth: {
            //         user: "ryzit1@gmail.com",
            //         pass: "etrikieegnaqqngu"
            //     }
            // })
            otp = Math.floor(Math.random() * 1000000)
            const mailOpts = {
                from: "ryzit1@gmail.com",
                to: req.body.email,
                subject: 'Verify Email Address',
                text: "Hi," + "\n\n" + 
                "To proceed further with your account verification at Cara Cognizance , Please use the 6-digit OTP given below.This OTP is only valid for 60 minutes"
                + "\n\n" + 
                otp + "\n\n" + 
                "Regards," +
                "Team ,Cara"
            }
            const response = await smtpTrans.sendMail(mailOpts)   
            var now = new Date();
            OTP.create({
                timeOfSending : now,
                otp : otp,
                email : req.body.email,
                username : req.body.username,
                password : req.body.password
            } , (err,createOtp) => {
                if(err){
                    console.log(error)
                    req.flash("error","Cannot Verify Your Email Right Now !!!")
                    res.redirect("/register") 
                }else{
                    res.redirect("/otp-" + req.body.email + "-" + createOtp.id )
                }
            } )
        }
        catch(err){
            console.error(err)
            req.flash("error","Cannot Verify Your Account !!!")
            res.redirect("/register")
        }
    }
}
module.exports = register