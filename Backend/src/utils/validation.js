const validator = require("validator")

const validateSignupData = (req) => {
    const {firstName, lastName, email, password} = req.body

    if(!firstName || !lastName){
        throw new Error("Name is not valid")
    }
    else if(firstName.length < 4  || firstName.length > 25){
        throw new Error("first name length is invalid")
    }

    else if(!validator.isEmail(email)){
        throw new Error("email is not valid")
    }

    else if(!validator.isStrongPassword(password)){
        throw new Error("password is not strong")
    }
}

module.exports = {validateSignupData}