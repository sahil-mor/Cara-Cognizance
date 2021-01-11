// const uuid = require("uuid")
// const path = require("path")
// const multer = require("multer")
// const cloudinary = require("../../config/cloudinary")

const User = require("../user/User")
const UserItem = require("../userItem/UserItem")
const ImageLink = require("../imagesLink/imageLink")


const addMemberFunc = async (req,res) => {
    
        try{
            const user = await User.findById(req.user.id)
            const { name  , address, phoneNumber , dateOfBirth, email } = req.body

            // For uploading image to cloud
            // const result = await cloudinary.uploader.upload(req.file.path);
            // const imageUrl = result.secure_url

            const imageUrl = req.file.path
            
            const image = {
                imageUrl ,
                // cloudinary_id : result.public_id
                cloudinary_id : Math.random() * 100 // any random number for local storing image
            }

            const imageLink = await ImageLink.create({
              imageUrl,
            })
            
            const newUserItem = await UserItem.create({
                parent : user,
                image ,
                date : new Date(),
                imageLink,
                name  , address, phoneNumber , dateOfBirth, email 
            })

            imageLink.userItem = newUserItem
            imageLink.name = name

            const savedLink = await imageLink.save()

            user.familyMembers.unshift(newUserItem)
            const savedUser = await user.save()
            const updatedUser = await User.findByIdAndUpdate(req.user.id,savedUser )
            req.flash("success","Family member added successfully !!!")
            res.redirect(`/index`)
        }
        catch(err){
            console.log(err)
            req.flash("error","Cannot Add Family member Right Now !!!")
            res.redirect("/index")
        }
}

module.exports = addMemberFunc