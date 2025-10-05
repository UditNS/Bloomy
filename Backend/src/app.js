const express = require('express')

const app = express();

// order is important in express if i put the /ne router before the / route then it works fine

// If i just use the below code then all the routes have this only whether it is /ne or /anything 

// app.use("/",(req, res) => { //nything which matches after "/" the below route will be called 
//     res.send("hellp dude i am on the server")
// }) // the text will be shown in all the url like/, /name, /anything

app.use("/test", (req, res) => {
    res.send("hellp dude i am on the server")// only show this in /new
})

app.listen(3000, () => {
    console.log("My server is listening on the port 3000")
})

// To test the api we will not use the browser as it the worst way to test instead we will be using postman
//In postman we click on 'new' at the left top then select http

// Now we look how we can handle different methods at the same url like in /profile we handle GET, POST, PATCH request