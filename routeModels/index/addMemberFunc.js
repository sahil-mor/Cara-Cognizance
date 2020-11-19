const uuid = require("uuid")
const path = require("path")
const multer = require("multer")
const cloudinary = require("../../config/cloudinary")

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
    
    uploads(req,res ,async (err) => {
        if(err){
            console.log(err)
            req.flash("error","Cannot Add Data Right Now !!!")
            res.redirect("/index")
        }
        try{
            const user = await User.findById(req.user.id)

            const result = await cloudinary.uploader.upload(req.file.path);
            const imageUrl = result.secure_url
            
            const image = {
                imageUrl ,
                cloudinary_id : result.public_id
            }

            const imageLink = await ImageLink.create({
              imageUrl,
            })
            
            const newUserItem = await UserItem.create({
                parent : user,
                image ,
                date : new Date(),
                imageLink
            })

            imageLink.userItem = newUserItem

            const savedLink = await imageLink.save()

            user.familyMembers.unshift(newUserItem)
            const savedUser = await user.save()
            const updatedUser = await User.findByIdAndUpdate(req.user.id,savedUser )
            req.flash("success","Image added successfully, enter other fields as well !!!")
            res.redirect(`/editMember-${newUserItem.id}`)
        }
        catch(err){
            console.log(err)
            req.flash("error","Cannot Add Data Right Now !!!")
            res.redirect("/index")
        }
        

    } )
    
}

module.exports = addMemberFunc