const express = require("express")
const {userAuth} = require("../middlewares/auth")
const bcrypt = require("bcrypt")
const User = require('../models/user')
const profileRouter = express.Router()

profileRouter.get("/userId/:id", userAuth, async (req, res) => {
    try {
        const targetId = req.params.id
        const response = await User.findById(targetId).select("firstName lastName photo");
        res.send(response)
    } catch (error) {
        res.status(401).send("error occured : " + error.message)
    }
})

profileRouter.get('/view',userAuth, async (req, res) => {
    try{
        const user = req.user
        res.send(user)
    }catch(error){
        res.status(401).send("error occured : " + error.message)
    }
})

profileRouter.patch('/edit', userAuth, async (req, res) => {
  const userId = req.user._id;
  const data = req.body;

  const ALLOWED_UPDATES = [
    "firstName", "lastName", "photo", "description", "gender", "age", "skill"
  ];

  try {
    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }

    const updatedUser = await User.findByIdAndUpdate(userId, data, {
      new: true,
      runValidators: true
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User updated successfully",
      user: updatedUser
    });

  } catch (err) {
    res.status(500).send(`Something went wrong: ${err.message}`);
  }
});


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