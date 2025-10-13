const mongoose = require('mongoose')
require('dotenv').config()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstName : {
        type: String,
        required : true,
        minLength : 4,
        maxLength: 25,
        trim: true

    },
    lastName : {
        type: String,
        required : true,
        minLength : 4,
        maxLength: 25,
        trim: true

    },
    email : {
        type: String,
        required : true,
        unique: true, // what will happen -> same email id not allowed
        lowercase: true,
        trim: true, // remove blank spaces
    },
    password : {
        type: String,
        required : true,
        minLength: 8,
    },
    age : {
        type: Number,
        required: true,
        min: 18,
        max: 130
    },
    gender: {
        type: String,
        trim: true,
        lowercase: true, // Add this to normalize the input
        validate: {
            validator: function(val) {
            // Allow empty/undefined values if gender is optional
        if (!val) return true;
            return ["male", "female", "other"].includes(val);
        },
    message: "Gender must be either male, female, or other"
    }
    }, 
    photo: {
        type: String,
        default : "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png"
    },
    description : {
        type: String,
        default : "Hey, there I am using Bloomy",
        maxLength : 250
    },
    skill : {
        type : [String], // array of strings
        validate : (val) => {
            if(val.length > 10){
                throw new Error("Only 10 skills are allowed")
            }
        }
    }
},
{
    //this will add by default when the user created a document and when the user updated the doucment 
    timestamps: true,
})

// helper function of userSchema
userSchema.methods.getJwt = async function() {// NEVER USE ARROW FUNCTION HERE IT WILL BREAK THINGS UP
    const userObj = this;
    const token = await jwt.sign({_id: userObj._id}, process.env.SECRET_KEY, {expiresIn : "7d"})

    return token
}

userSchema.methods.passwordCheck = async function (passwordWrittenByUser){
    const userObj = this
    const crediential = await bcrypt.compare(passwordWrittenByUser, userObj.password)
    return crediential
}


const User = mongoose.model('User', userSchema) // 
// Has to be capital
module.exports = User