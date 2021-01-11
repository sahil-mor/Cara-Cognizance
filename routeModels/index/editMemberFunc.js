const cloudinary = require("../../config/cloudinary")

const User = require("../user/User")
const UserItem = require("../userItem/UserItem")
const ImageLink = require("../imagesLink/imageLink")

const addMemberFunc = async (req,res) => {
    const { userItemId } = req.params
    const user = await User.findById(req.user.id)

    try{  
        const userItem = await UserItem.findById(userItemId)
        const { name  , address, phoneNumber , dateOfBirth, email } = req.body
        userItem.name = name
        userItem.address = address
        userItem.phoneNumber = phoneNumber
        userItem.dateOfBirth = dateOfBirth
        userItem.email = email

        if(req.file){
            // if( userItem.image.cloudinary_id != "ppupkcvzznejm0c6tylm" ){
            //     // For deleting image from cloud
            //     // var deleted = await cloudinary.uploader.destroy(userItem.image.cloudinary_id);
            // }else{
            //     // console.log("no need to delete")
            // }
            // For uploading image to cloud
            // const result = await cloudinary.uploader.upload(req.file.path);
            // const imageUrl = result.secure_url
            const imageUrl = req.file.path
        
            const image = {
                imageUrl ,
                // cloudinary_id : result.public_id
                cloudinary_id : Math.random() * 100 // any random number for local storing image
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
        }else{
            const imageLink = await ImageLink.findById(userItem.imageLink)
        
            imageLink.name = name
        
            const savedLink = await imageLink.save()
        }

        const savedUserItem = await userItem.save()
        req.flash("success","Data Updated Successfully !!!")
        res.redirect("/index")
        
    }
    catch(err){
        console.log(err)
        req.flash("error","Cannot Add Data Right Now !!!")
        res.redirect("/index")
    }    
}

module.exports = addMemberFunc