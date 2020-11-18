const express = require("express")
const router = express.Router();
const middleware = require("../middleware")

const commonPath = "../routeModels/index/"

const addMember = require(`${commonPath}addMember`)
const editMember = require(`${commonPath}editMember`)
const addMemberFunc = require(`${commonPath}addMemberFunc`)
const editMemberFunc = require(`${commonPath}editMemberFunc`)
const viewItem = require(`${commonPath}viewItem`)
const searchItem = require(`${commonPath}searchItem`)
const searchedUsers = require(`${commonPath}searchedUsers`)
const deleteView = require(`${commonPath}deleteView`)

router.get("/addMember",middleware.isLoggedIn, addMember )
router.post("/addMember",middleware.isLoggedIn,addMemberFunc)

router.get("/editMember-:userItemId",middleware.isLoggedIn,editMember)
router.post("/editMember-:userItemId",middleware.isLoggedIn,editMemberFunc)

router.get("/viewItem-:userItemId",middleware.isLoggedIn,viewItem )

router.get("/searchItem",middleware.isLoggedIn, searchItem )

router.get("/searchedUsers",middleware.isLoggedIn, searchedUsers )
router.get("/deleteView-:randomId",middleware.isLoggedIn,deleteView )

module.exports = router