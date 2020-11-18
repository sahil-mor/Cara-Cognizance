const forgotPassword = (req,res) => {
    res.render("auth/recoverPassword",{ title : "Forgot Password" })
}

module.exports = forgotPassword