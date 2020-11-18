const express = require("express")
var cors = require('cors')
var flash =  require("connect-flash")
const bodyParser = require("body-parser")
var passport = require("passport")
var LocalStratergy = require("passport-local")
const path = require("path")
const dotenv = require("dotenv")
dotenv.config()


const connectDB = require("./config/db")
var User = require("./routeModels/user/User")

const app = express()

connectDB()
app.use(cors())
app.use(express.static("public"))
app.use('/uploads',express.static("uploads"))
app.use(bodyParser.urlencoded({ extended : true }))
app.use(bodyParser.json());
app.set("view engine","ejs")

const authRoutes = require("./routes/auth")
const indexRoutes = require("./routes/index")
const resetPasswordRoutes = require("./routes/resetPassword")
const authorisedRoutes = require("./routes/authorised")

app.use(require("express-session")({
    resave : false, saveUninitialized : false , secret : "This is cara"
}))

app.use(flash());
app.use(function(req,res,next){
    res.locals.error = req.flash("error")
    res.locals.success = req.flash("success")
    next();
})

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStratergy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.get("/", async (req,res) => {
    if(req.user){
        if(req.user.isAuthorised){
            res.redirect("/authorised/index")
        }else{
            res.redirect("/index")
        }
    }else{
        res.render("auth/login",{ title : "Login" })
    }
} )

app.use(authRoutes)
app.use(indexRoutes)
app.use(resetPasswordRoutes)
app.use("/authorised/", authorisedRoutes)

app.get("/resetPassword",(req,res) => {
    res.render("reset",{ user : req.user })
} )


app.get("/sessionExpired",function(req,res){
    req.flash("error","Sign in to continue!!!")
    res.redirect("/")
})


const port = process.env.PORT || 3000

app.listen(port,() => {
    console.log(`Server at ${port}`)
} )