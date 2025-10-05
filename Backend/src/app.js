const express = require('express')

const app = express();

// This will only handle GET call to the /user
app.get('/user', (req, res)=>{
    res.send({
        'firstName': "udit",
        'lastName': "ns"
    })
})

app.post('/user', (req, res)=>{
    console.log("Saved the data to the db")
    res.send("data successfully saved")
})

app.delete('/user', (req, res) => {
    console.log("user profile deleted successfully")
    res.send("user is deleted")
})

// this will handle all the HTTP method to this /test 
app.use("/test", (req, res) => {
    res.send("hellp dude i am on the server")// only show this in /new
})

app.listen(3000, () => {
    console.log("My server is listening on the port 3000")
})

