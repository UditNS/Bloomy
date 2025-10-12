const express = require("express")
const {userAuth} = require("../middlewares/auth")
const bcrypt = require("bcrypt")
const User = require('../models/user')

const profileRouter = express.Router()

profileRouter.get('/view',userAuth, async (req, res) => {
    try{
        const user = req.user
        res.send(user)
    }catch(error){
        res.status(401).send("error occured : " + error.message)
    }
})

profileRouter.patch('/edit', userAuth, async (req, res) => { 
    const userId = req.user._id
    const data = req.body // data which needed to be changed

    const ALLOWED_UPDATES = [
        "firstName", "lastName", "photoUrl", "description", "gender", "age", "skill"
    ]

    try{
        const isUpdateAllowed = Object.keys(data).every((k) => 
            ALLOWED_UPDATES.includes(k)
        )
        
        if(!isUpdateAllowed){
            throw new Error("Update not allowed")
        }
        // here data also consist the _id but we didn't define it in schema. So, it will be ignored by mongodb
        const updatedUser = await User.findByIdAndUpdate({_id: userId}, data, {
            new: true, // it will return the updated document
            runValidators: true // this will run validation 
        });
        res.json({
            message: "User updated successfully",
            user: updatedUser,
    });
    }catch(err){
        res.status(500).send(`something went wrong ${err.message}`)
    }
})

profileRouter.patch('/resetPassword', userAuth, async (req, res) => {
    try{

        const oldPassword = req.body.password;
        const newPassword = req.body.newPassword;

        if (!oldPassword || !newPassword) {
            throw new Error("Both old and new passwords are required");
        }

        if (newPassword.length < 8) {
            throw new Error("New password must be at least 8 characters");
        }

        if (oldPassword === newPassword) {
            throw new Error("New password must be different from old password");
        }

        const user = req.user;
        const checkPass = await user.passwordCheck(oldPassword);

        if(checkPass){
            const updatedPassword = await bcrypt.hash(newPassword, 10);
            const {_id} = req.user;

            const update = await User.findByIdAndUpdate((_id), {password: updatedPassword}, {new: true})

            res.send("password Changed successfully")

        }
        else{
            throw new Error("incorrect old password")
    }
    }catch(error){
        res.status(401).send("Something went wrong " + error.message)
    }
})


module.exports = profileRouter;