const express = require('express')
const User = require('../models/user')
const {userAuth} = require("../middlewares/auth")
const Chat = require('../models/chat')
const chatRouter = express.Router()

chatRouter.get("/userId/:id", userAuth, async (req, res) => {
    try {
        const targetId = req.params.id
        const response = await User.findById(targetId).select("firstName lastName photo");
        res.send(response)
    } catch (error) {
        res.status(401).send("error occured : " + error.message)
    }
})

chatRouter.get('/message/:id', userAuth, async(req,res) => {
    try{
        const targetUserId = req.params.id
        const userId = req.user._id
        let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] }
        })
        if(!chat){
            chat = new Chat({
                participants: [userId, targetUserId],
                messages: []
            })
            await chat.save()
        }
        res.json(chat)
    }catch(error){
        res.status(401).send("error occured : " + error.message)
    }
})

module.exports = chatRouter