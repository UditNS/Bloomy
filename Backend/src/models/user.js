const mongoose = require('mongoose')
require('dotenv').config()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
    {
    firstName: {
        type: String,
        required: [true, "First name is required"],
        minlength: [2, "First name must be at least 2 characters"],
        maxlength: [20, "First name cannot exceed 20 characters"],
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
        minlength: [2, "Last name must be at least 2 characters"],
        maxlength: [20, "Last name cannot exceed 20 characters"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters"],
        
    },
    age: {
        type: Number,
        required: [true, "Age is required"],
        min: [18, "You must be at least 18 years old"],
        max: [90, "Age cannot exceed 90 years"],
    },
    gender: {
        type: String,
        trim: true,
        lowercase: true,
        enum: {
            values: ["male", "female", "other"],
            message: "Gender must be either 'male', 'female', or 'other'",
        },
    },
    photo: {
        type: String,
        default:
            "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png",
    },
    description: {
        type: String,
        default: "Hey there, I’m using Bloomy!",
        maxlength: [500, "Description cannot exceed 500 characters"],
        trim: true,
    },
    skill: {
        type: [String],
        validate: {
            validator: (val) => val.length <= 10,
            message: "A maximum of 10 skills are allowed",
        },
        },
    },
    {
    timestamps: true,
    }
);

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