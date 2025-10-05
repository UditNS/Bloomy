const express = require('express')

const app = express();

// app.get("/route", rh1, rh2, [rh3, rh4], rh5)
// I can wrap routes inside an array and it works the same

    // One route can handle multiple route handler
app.get('/user', (req, res, next)=>{
    // This function is known as route handler
    // if we don't send the response back it will be stuck in loop to get the response and gave error as Could not get response
    res.send("Handling route 1")
    console.log("route 1")
    next()
    
}, (req, res, next) => {
    // route handler 2
    res.send("Handling route 2")
    console.log("route 2")
    next()
},
(req, res) => {
    // route handler 2
    res.send("Handling route 3")
    console.log("route 3")
})

app.listen(3000, () => {
    console.log("My server is listening on the port 3000")
})

