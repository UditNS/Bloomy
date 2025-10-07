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

// signup
app.post('/signup', async(req, res) => {
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
app.post('/login', async (req,res) => {
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