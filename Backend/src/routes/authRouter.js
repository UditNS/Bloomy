const express = require("express")
const {validateSignupData} = require("../utils/validation")
const bcrypt = require('bcrypt')
const User = require('../models/user')
const {userAuth} = require("../middlewares/auth")


const authRouter = express.Router()

//signup
authRouter.post('/signup', async(req, res) => {
    try{
    const {firstName, lastName, email, password, age, gender, skill, description} = req.body
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
        gender,
        skill,
        description,
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
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const userObj = await User.findOne({ email:email })
        if(!userObj){
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const checkCrediential = await userObj.passwordCheck(password);
        if(checkCrediential){
            // create a jwt token
            const token = await userObj.getJwt();
            // add the token into the cookie and send back the response to the client
            res.cookie("token", token, {
                httpOnly: true,
                sameSite: "lax",
                secure: true
            });
            res.json({ _id, firstName, lastName, email, photo })
        }
        else{
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }
    }catch(error){
        res.send(`Something went wrong : ${error.message}`)
    }
})

//logout
authRouter.post('/logout', userAuth, async(req,res) => {
    try{
        res.clearCookie('token', {secure:true});
        res.send("logged out successfully")
    }
    catch(error){
        res.status(400).send("Something went wrong" + error.message)
    }
})

module.exports = authRouter;