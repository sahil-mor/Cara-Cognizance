const express = require("express")
const router = express.Router();
const passport = require("passport")

const commonPath = "../routeModels/user/"

const register = require(`${commonPath}register`)
const indexRoute = require(`${commonPath}indexRoute`)
var verifyOtp = require(`${commonPath}verifyOtp`)
var verifyOtpFunc = require(`${commonPath}verifyOtpFunc`)

var middleware = require("../middleware")

router.post("/login",passport.authenticate("local",{
    failureRedirect : "/wrongCredentials"
}),middleware.isLoggedIn, (req,res) => {
    req.flash("success",`Welcome Back, ${req.user.username} ` )
    res.redirect("/index")
})

router.get("/register",(req,res) => {
    res.render("auth/register",{ title : "Register" })
} )

router.post("/register",register)

router.get("/verifyOtp-:otpId",verifyOtp)
router.post("/verifyOtp-:otpId",verifyOtpFunc)

router.get("/wrongCredentials", (req,res) => {
    req.flash("error","USERNAME OR PASSWORD IS WRONG")
    res.redirect("/")
})

router.get("/sessionExpired",(req,res) => {
    req.flash("error","Sign in to continue!!!")
    res.redirect("/")
})

router.get("/index",middleware.isLoggedIn,indexRoute)

router.get("/logout", (req,res) => { 
    var redirectTo = '/'
    if(req.user.isAuthorised){
        redirectTo = '/authorised'
    }
    req.logout();
    req.flash("success","SUCCESSFULLY LOGGED YOU OUT")
    res.redirect(`${redirectTo}`)
})



module.exports = router