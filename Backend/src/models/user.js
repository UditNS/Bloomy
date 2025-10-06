const mongoose = require('mongoose')

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
        maxLength: 20,
        trim: true
    },
    age : {
        type: Number,
        required: true,
        min: 18,
        max: 130
    },
    gender : {
        type: String,
        trim: true,
        // by default this validate ethod is only called when the user is created. If we update the userDetails then this fn will not be called and we can put anything inside it.
        validate : (val) => {
            if(!["male", "female", "other"].includes(val)){
                throw new Error("Gender is not valid ")
            }
        }
    },
    photo: {
        type: String,
        default : "https://avatars.mds.yandex.net/i?id=0e8e5432af0aa80f3182168e6530f089e9f45080-5231722-images-thumbs&n=13"
    },
    description : {
        type: String,
        default : "Hey, there I am using Bloomy",
        maxLength : 250
    },
    skill : {
        type : [String], // array of strings
        validate : (val) => {
            if(val.length > 30){
                throw new Error("Only 30 skills are allowed")
            }
        }
    }
},
{
    //this will add by default when the user created a document and when the user updated the doucment 
    timestamps: true,
})

const User = mongoose.model('User', userSchema) // 
// Has to be capital
module.exports = User