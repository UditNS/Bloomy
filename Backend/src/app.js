const express = require('express')

const app = express();
// handling autherization
const {adminAuth} = require('./middlewares/auth')

app.use('/admin', adminAuth)

app.get('/admin/getalluser', (req, res) => {
    try{
        console.log('user autherized')
        res.send("getting user data");
    }catch(error){
        res.status(500).send("something went wrong when tried to get all user")
    }
})

app.get('/admin/deleteUser', (req, res) => {
    res.send('deleteing the user')
})

app.get('/user', (req, res, next)=>{
    res.send("Handling route 1")
    console.log("route 1")
    next()
})

// Error handling-> order matter at the end
app.use('/', (err, req, res, next)=> {
    if(err){
        res.status(500).send("something went wrong")
    }
    // Why handle error this way
    // because if we don't then it can expose the insights of project
    // always use try catch block
})

app.listen(3000, () => {
    console.log("My server is listening on the port 3000")
})