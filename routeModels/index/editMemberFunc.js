const cloudinary = require("../../config/cloudinary")
const path = require("path")
const multer = require("multer")
const uuid = require("uuid")

const User = require("../user/User")
const UserItem = require("../userItem/UserItem")
const ImageLink = require("../imagesLink/imageLink")


const storage = multer.diskStorage({
    filename : function(req,file,cb){
        cb(null,file.fieldname + "-" + uuid.v4() + path.extname(file.originalname));
    }
})


const uploads = multer({
    storage : storage,
}).single('uri')


const addMemberFunc = async (req,res) => {
    const { userItemId } = req.params
    const user = await User.findById(req.user.id)

    const userItem = await UserItem.findById(userItemId)
    uploads(req,res ,async (err) => {
        if(err){
            console.log(err)
            req.flash("error","Cannot Add Data Right Now !!!")
            res.redirect("/index")
        }
        try{
            if(req.file){
                if( user.image.cloudinary_id != "ppupkcvzznejm0c6tylm" ){
                    console.log("i m here")
                    await cloudinary.uploader.destroy(user.image.cloudinary_id);
                }
                const result = await cloudinary.uploader.upload(req.file.path);
                const imageUrl = result.secure_url
            
                const image = {
                    imageUrl ,
                    cloudinary_id : result.public_id
                }
                userItem.image = image
                if( user.userItem == userItemId ){
                    user.image = image
                    const savedUser = await user.save()
                    const updatedUser = await User.findByIdAndUpdate(req.user.id,savedUser)
                }
                
                const imageLink = await ImageLink.findById(userItem.imageLink)
                
                imageLink.imageUrl = imageUrl

                const savedLink = await imageLink.save()

                const savedUserItem = await userItem.save()
                req.flash("success","Data Updated Successfully !!!")
                res.redirect("/index")
            }else{
                const { name  , address, phoneNumber , dateOfBirth } = req.body
                userItem.name = name
                userItem.address = address
                userItem.phoneNumber = phoneNumber
                userItem.dateOfBirth = dateOfBirth

                const imageLink = await ImageLink.findById(userItem.imageLink)
                
                imageLink.name = name

                const savedLink = await imageLink.save()

                const savedUserItem = await userItem.save()
                req.flash("success","Data Updated Successfully !!!")
                res.redirect("/index")
            }            
        }
        catch(err){
            console.log(err)
            req.flash("error","Cannot Add Data Right Now !!!")
            res.redirect("/index")
        }
    } )
    
}

module.exports = addMemberFunc