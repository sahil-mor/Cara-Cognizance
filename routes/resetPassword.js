const express = require("express")
const router = express.Router();

const commonPath = "../routeModels/resetPassword/"

const forgotPassword = require(`${commonPath}forgotPassword`)
const forgotPasswordFunc = require(`${commonPath}forgotPasswordFunc`)
const resetPassword = require(`${commonPath}resetPassword`)
const resetPasswordFunc = require(`${commonPath}resetPasswordFunc`)
const setPassword = require(`${commonPath}setPassword`)
const setPasswordFunc = require(`${commonPath}setPasswordFunc`)


router.get("/forgotPassword",forgotPassword )
router.post("/forgotPassword",forgotPasswordFunc)

router.get("/resetPassword-:otpId",resetPassword)
router.post("/resetPassword-:otpId",resetPasswordFunc)

router.get("/setPassword-:userID",setPassword)
router.post("/setPassword-:userID",setPasswordFunc)

module.exports = router