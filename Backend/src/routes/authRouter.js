const express = require("express")
const {validateSignupData} = require("../utils/validation")
const bcrypt = require('bcrypt')
const User = require('../models/user')

const authRouter = express.Router()

authRouter.post('/signup', async(req, res) => {
    try{
    const {firstName, lastName, email, password, age, skill} = req.body
    // validation
    validateSignupData(req);

    // encrypt the password (using bcrypt)
    const hashPassword = await bcrypt.hash(password, 10)

    // creating a new instance of the user Model
    const user = new User({
        firstName,
        lastName,
        email,
        age,
        skill,
        password: hashPassword
    }) // creating a new data with userObj

        await user.save() // this will save the data to the database // a promise
        res.send("user added successfully")
    }
    catch(error){
        res.status(500).send("error occured : " + error.message)
    }

    // In the database there are two other fields (__v, _id) -> these are created by mongodb
    // _id -> unique id 
})

//login
authRouter.post('/login', async (req,res) => {
    try{
        const {email, password} = req.body

        const userObj = await User.findOne({ email:email })
        if(!userObj){
            throw new Error("Email id or password is incorrect")
        }

        const checkCrediential = userObj.passwordCheck(password);
        if(checkCrediential){
            // create a jwt token
            const token = await userObj.getJwt();
            // add the token into the cookie and send back the response to the client
            res.cookie("token", token)
            
            res.send("user logged in successfully")
        }
        else{
            throw new Error("Email id or password is incorrect")
        }
    }catch(error){
        res.send(`Something went wrong : ${error.message}`)
    }
})

module.exports = authRouter;