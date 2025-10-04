const express = require('express')

const app = express();

// app.use( (req, res) => {
//     res.send("hellp dude i am on the server")
// }) // the text will be shown in all the url like/, /name, /anything

app.use("/ne", (req, res) => {
    res.send("hellp dude i am on the server")// only show this in /new
})

app.listen(3000, () => {
    console.log("My server is listening on the port 3000")
})