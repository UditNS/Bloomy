const connectDB = require('./config/database')
const express = require('express')
const app = express();
// userModel
const User = require('./models/user')


app.post('/signup', async(req, res) => {
    const userObj ={
        firstName : "Alia",
        lastName: "Bhatt",
        email : "udit@gmail.com",
        password : "udit@1234",
        // age : 23,
        // gender : "M"
    } 
    // creating a new instance of the user Model
    const user = new User(userObj) // creating a new data with userObj
    try{
        await user.save() // this will save the data to the database // a promise
        res.send("user added successfully")
    }
    catch(error){
        res.status(500).send("error occured" + error.message)
    }

    // In the database there are two other fields (__v, _id) -> these are created by mongodb
    // _id -> unique id 
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

