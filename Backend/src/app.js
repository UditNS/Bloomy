const connectDB = require('./config/database')
const express = require('express')
const app = express();
const {validateSignupData} = require("./utils/validation")
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const {userAuth} = require("./middlewares/auth")
// userModel
const User = require('./models/user')


// convert json into js object
app.use(express.json());
app.use(cookieParser())


//profile
app.get('/profile',userAuth, async (req, res) => {
    try{
        const user= req.user
        res.send(user)
    }catch(error){
        res.status(400).send("error occured : " + error.message)
    }

})

// sent connection request
app.post('/sendConnectionRequest', userAuth, async (req,res) => {
    try{
        const user = req.user;

        res.send(`${user.firstName} sent you the request`);
    }
    catch(error){
        res.status(400).send("Something went wrong : " + error.message)
    }
})


// get user by email (find a user )
app.get('/user', async(req, res) => {
    const userEmail = req.body.email;

    try{
        const users = await User.find({email: userEmail})
        if(users.length === 0){
            res.status(404).send("user not found")
        }
        res.send(users)
    }
    catch(err){
        res.status(400).send(`something went wrong ${err.message}`)
    }

})

// Feed api -> GET /feed -> get all the user from the database
app.get('/feed', async(req, res) => {
    const allUser = await User.find({}) // passing empty filter ->it will send all the user 

    res.send(allUser )
})

// findById() function
app.get('/id', async (req, res) => {
    try{
        const userId = req.body._id;
        const userDetails = await User.findById(userId)
        res.send(userDetails)
    }
    catch(error){
        res.status(500).send(`something went wrong. here is the error message: ${error.message}`)
    }

})

// Delete API -> findById and delete
app.use('/delete', async(req,res) => {
    const userId = req.body._id
    try{
        await User.findByIdAndDelete(userId)
        res.send("user deleted")
    }
    catch(error){
        
    }
})

// Update API
app.patch('/update', async(req,res) => {
    const userId = req.body._id
    const data = req.body // data which needed to be changed

    const ALLOWED_UPDATES = [
        "userId","photoUrl", "description", "gender", "age", "skills"
    ]

    

    try{
        const isUpdateAllowed = Object.keys(data).every((k) => {
        ALLOWED_UPDATES.includes(k);
        })
        if(!isUpdateAllowed){
            throw new Error("Update not allowed")
        }
        // here data also consist the _id but we didn't define it in schema. So, it will be ignored by mongodb
        const user = await User.findByIdAndUpdate({_id: userId}, data, {
            returnDocument: "after", // it will return the updated document
            runValidators: true // this will run validation 
        });
        res.send("user updated successfully")
    }catch(err){
        res.status(500).send(`something went wrong ${err.message}`)
    }
})

connectDB().then(()=>{
    console.log('db connect successfully')
    // once my db is connected successfully then only I will listen to the server(this is the proer way of db connect)
    app.listen(3000, () => {
        console.log("My server is listening on the port 3000") 
    })
}).catch((err) => {
    console.log('db cannot be connected!!!')
    console.log(err); 
})