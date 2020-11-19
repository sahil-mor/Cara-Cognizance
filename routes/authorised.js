const express = require("express")
const router = express.Router();
const passport = require("passport")

const commonPath = "../routeModels/authorised/"

const register = require(`${commonPath}register`)
const indexRoute = require(`${commonPath}indexRoute`)
const verifyOtp = require(`${commonPath}verifyOtp`)
const verifyOtpFunc = require(`${commonPath}verifyOtpFunc`)

var middleware = require("../middleware")

router.get("/",(req,res) => {
    res.render("authorised/login",{ title : "Login" })
} )

router.post("/login",passport.authenticate("local",{
    failureRedirect : "/wrongCredentials"
}),middleware.isLoggedIn,function(req,res){
    res.redirect("/authorised/index")
})

router.get("/register",(req,res) => {
    res.render("authorised/register",{ title : "Register" })
} )

router.post("/register",register)

router.get("/verifyOtp-:otpId", verifyOtp )
router.post("/verifyOtp-:otpId", verifyOtpFunc )

router.get("/wrongCredentials",function(req,res){
    req.flash("error","USERNAME OR PASSWORD IS WRONG")
    res.redirect("/authorised")
})

router.get("/sessionExpired",function(req,res){
    req.flash("error","Sign in to continue!!!")
    res.redirect("/authorised")
})

router.get("/index",middleware.isLoggedIn,indexRoute)

router.get("/logout",function(req,res){
    if(req.user){
        req.logout();
        req.flash("success","SUCCESSFULLY LOGGED YOU OUT")
        res.redirect("/authorised")
    }else{
        req.flash("error","NO USER LOGGED IN")
        res.redirect("/authorised")
    }
})


module.exports = router