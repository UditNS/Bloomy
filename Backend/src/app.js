const connectDB = require('./config/database')
const express = require('express')
const app = express();

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

