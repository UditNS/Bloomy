const express = require("express")
const {userAuth} = require("../middlewares/auth")

const profileRouter = express.Router()

profileRouter.get('/view',userAuth, async (req, res) => {
    try{
        const user= req.user
        res.send(user)
    }catch(error){
        res.status(400).send("error occured : " + error.message)
    }
})


module.exports = profileRouter;