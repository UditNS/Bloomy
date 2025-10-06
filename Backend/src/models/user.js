const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName : String,
    lastName : String,
    email : String,
    password : String,
    age : Number,
    gender : {
        type: String
    }
})

const User = mongoose.model('User', userSchema) // 
// Has to be capital
module.exports = User