const express = require('express')

const app = express();
// handling autherization
const {adminAuth} = require('./middlewares/auth')

app.use('/admin', adminAuth)

app.get('/admin/getalluser', (req, res) => {
    console.log('user autherized')
    res.send("getting user data");
})

app.get('/admin/deleteUser', (req, res) => {
    res.send('deleteing the user')
})

app.get('/user', (req, res, next)=>{
    res.send("Handling route 1")
    console.log("route 1")
    next()
})

app.listen(3000, () => {
    console.log("My server is listening on the port 3000")
})